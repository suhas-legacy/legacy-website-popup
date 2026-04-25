# Terraform configuration for GCP Cloud Run deployment
# Usage: terraform init && terraform apply

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  backend "gcs" {
    bucket = "legacy-website-terraform-state"
    prefix = "cloud-run"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Variables
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "legacy-website-service"
}

variable "image_name" {
  description = "Docker image name"
  type        = string
  default     = "legacy-website"
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com"
  ])

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}

# Artifact Registry repository
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "legacy-website-repo"
  description   = "Docker repository for legacy website"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}

# Secret Manager secrets
resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "GEMINI_API_KEY"

  replication {
    automatic = true
  }

  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret" "FINNHUB_API_KEY" {
  secret_id = "FINNHUB_API_KEY"

  replication {
    automatic = true
  }

  depends_on = [google_project_service.apis]
}

# Cloud Run service
resource "google_cloud_run_v2_service" "default" {
  name     = var.service_name
  location = var.region
  project  = var.project_id

  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/legacy-website-repo/${var.image_name}:latest"

        ports {
          container_port = 3000
        }

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "NEXT_PUBLIC_SITE_URL"
          value = "https://legacyglobalbank.com"
        }

        env {
          name  = "PORT"
          value = "3000"
        }

        secret_key_refs {
          secret  = google_secret_manager_secret.gemini_api_key.secret_id
          version = "latest"
        }
      }

      scaling {
        min_instance_count = 0
        max_instance_count = 100
      }

      timeout_seconds = 300
    }
  }

  traffic {
    percent = 100
    latest_revision = true
  }

  depends_on = [google_project_service.apis]
}

# IAM: Allow public access
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.default.location
  name     = google_cloud_run_v2_service.default.name
  project  = google_cloud_run_v2_service.default.project
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Cloud Build trigger
resource "google_cloudbuild_trigger" "auto_deploy" {
  name        = "legacy-website-auto-deploy"
  description = "Auto deploy on push to main branch"
  location    = var.region
  project     = var.project_id

  github {
    owner = "your-github-username"
    name  = "legacy-website-popup"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"

  depends_on = [google_project_service.apis]
}

# Outputs
output "service_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.default.uri
}

output "repository_url" {
  description = "Artifact Registry repository URL"
  value       = google_artifact_registry_repository.docker_repo.name
}
