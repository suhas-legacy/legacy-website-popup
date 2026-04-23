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
