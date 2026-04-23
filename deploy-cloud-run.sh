#!/bin/bash

# Cloud Run Deployment Script for GCP
# Usage: ./deploy-cloud-run.sh [PROJECT_ID] [REGION] [SERVICE_NAME]

set -e

# Default values
PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
SERVICE_NAME=${3:-legacy-website-service}
REPO_NAME=legacy-website-repo
IMAGE_NAME=legacy-website

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cloud Run Deployment Script ===${NC}"
echo -e "Project ID: ${YELLOW}$PROJECT_ID${NC}"
echo -e "Region: ${YELLOW}$REGION${NC}"
echo -e "Service Name: ${YELLOW}$SERVICE_NAME${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo -e "${RED}Error: Not authenticated with gcloud. Run: gcloud auth login${NC}"
    exit 1
fi

# Enable required APIs
echo -e "${GREEN}Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    --project=$PROJECT_ID

# Create Artifact Registry repository if it doesn't exist
echo -e "${GREEN}Checking Artifact Registry repository...${NC}"
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION --project=$PROJECT_ID &> /dev/null; then
    echo -e "${YELLOW}Creating Artifact Registry repository...${NC}"
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for legacy website" \
        --project=$PROJECT_ID
fi

# Configure Docker authentication for Artifact Registry
echo -e "${GREEN}Configuring Docker authentication...${NC}"
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

# Build and push Docker image
IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:$(date +%s)"
echo -e "${GREEN}Building Docker image: $IMAGE_URI${NC}"
docker build -t $IMAGE_URI .

echo -e "${GREEN}Pushing Docker image...${NC}"
docker push $IMAGE_URI

# Deploy to Cloud Run
echo -e "${GREEN}Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image=$IMAGE_URI \
    --region=$REGION \
    --platform=managed \
    --allow-unauthenticated \
    --port=3000 \
    --memory=512Mi \
    --cpu=1 \
    --max-instances=100 \
    --min-instances=0 \
    --timeout=300 \
    --concurrency=80 \
    --set-env-vars=NODE_ENV=production,NEXT_PUBLIC_SITE_URL=https://legacyglobalbank.com \
    --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
    --set-secrets=FINNHUB_API_KEY=FINNHUB_API_KEY:latest \
    --project=$PROJECT_ID

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format="value(status.url)" \
    --project=$PROJECT_ID)

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "Service URL: ${YELLOW}$SERVICE_URL${NC}"
echo -e "Region: ${YELLOW}$REGION${NC}"
echo ""
echo -e "${GREEN}To view logs:${NC}"
echo "gcloud logs tail /projects/$PROJECT_ID/logs/run.googleapis.com%2F%2F$SERVICE_NAME --region=$REGION"
