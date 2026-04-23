# GCP Deployment Guide

This guide covers deploying the legacy website to Google Cloud Platform using Cloud Run.

## Prerequisites

- GCP Project with billing enabled
- gcloud CLI installed and configured
- Docker installed locally
- Appropriate IAM permissions

## Initial Setup

### 1. Set up GCP Project

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Configure Secrets

```bash
# Create secrets for API keys
echo "your_gemini_api_key" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo "your_finnhub_api_key" | gcloud secrets create FINNHUB_API_KEY --data-file=-

# Verify secrets
gcloud secrets list
```

### 3. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create legacy-website-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker repository for legacy website"
```

## Deployment Methods

### Method 1: Manual Deployment Script

```bash
# Make script executable (Linux/Mac)
chmod +x deploy-cloud-run.sh

# Deploy with defaults
./deploy-cloud-run.sh

# Deploy with custom values
./deploy-cloud-run.sh YOUR_PROJECT_ID us-central1 custom-service-name
```

### Method 2: Cloud Build

```bash
# Deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml . \
  --substitutions=_REGION=us-central1,_REPO_NAME=legacy-website-repo,_IMAGE_NAME=legacy-website,_SERVICE_NAME=legacy-website-service
```

### Method 3: Terraform (Infrastructure as Code)

```bash
cd terraform

# Copy example variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your project ID

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

### Method 4: GitHub Actions CI/CD

1. Add the following secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_WORKLOAD_IDENTITY_PROVIDER`: Workload Identity Provider URL
   - `GCP_SERVICE_ACCOUNT_EMAIL`: Service account email

2. Push to main branch to trigger automatic deployment

## Health Check

After deployment, verify the service is running:

```bash
# Get service URL
gcloud run services describe legacy-website-service \
  --region=us-central1 \
  --format="value(status.url)"

# Check health endpoint
curl https://your-service-url/api/health
```

## Monitoring

### View Logs

```bash
# Tail logs in real-time
gcloud logs tail /projects/YOUR_PROJECT_ID/logs/run.googleapis.com%2F%2Flegacy-website-service \
  --region=us-central1

# View recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=legacy-website-service" \
  --limit 50 \
  --format="table(timestamp,severity,textPayload)"
```

### Monitor Service

```bash
# Get service details
gcloud run services describe legacy-website-service --region=us-central1

# View revisions
gcloud run revisions list --service=legacy-website-service --region=us-central1
```

## Scaling Configuration

The deployment uses the following scaling defaults:
- **Min instances**: 0 (scale to zero when idle)
- **Max instances**: 100
- **Memory**: 512Mi
- **CPU**: 1 vCPU
- **Timeout**: 300s
- **Concurrency**: 80

To adjust scaling:

```bash
gcloud run services update legacy-website-service \
  --region=us-central1 \
  --max-instances 200 \
  --min-instances 1 \
  --memory 1Gi \
  --cpu 2
```

## Troubleshooting

### Build Failures

```bash
# Check Cloud Build logs
gcloud builds list --limit 10
gcloud builds log BUILD_ID
```

### Deployment Failures

```bash
# Check deployment logs
gcloud run services logs read legacy-website-service --region=us-central1
```

### Permission Issues

```bash
# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="user:YOUR_EMAIL" \
  --role="roles/run.admin"
```

## Cost Optimization

1. **Scale to zero**: Set min-instances to 0 to save costs when idle
2. **Use appropriate memory**: Don't over-allocate memory
3. **Enable caching**: Configure CDN for static assets
4. **Monitor usage**: Set up budget alerts

## Security Best Practices

1. Use Secret Manager for sensitive data
2. Enable VPC connectors for private resources
3. Set up IAM least-privilege access
4. Enable audit logging
5. Regularly update base images

## Rollback

To rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service=legacy-website-service --region=us-central1

# Rollback to specific revision
gcloud run services update legacy-website-service \
  --region=us-central1 \
  --to-revisions=REVISION_NAME=100
```
