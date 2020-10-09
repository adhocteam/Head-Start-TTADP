###
# State management
###

terraform {
  backend "s3" {
    bucket         = "ohs-terraform-state"
    key            = "terraform.tfstate.dvp-dev"
    dynamodb_table = "ohs-terraform-lock"
    encrypt        = true
  }
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "ohs-terraform-state"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = "ohs-terraform-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

###
# Providers - service where infrastructure is instantiated
###

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

provider "cloudfoundry" {
  api_url      = var.cf_api_url
  user         = var.cf_user
  password     = var.cf_password
  app_logs_max = 30
}

###
# Cloud Foundry / Cloud.gov connections
###

# - account inputs

data "cloudfoundry_space" "space" {
  org_name = var.cf_org_name
  name     = var.cf_space_name
}

data "service_account" "service_account" {
  org_name = var.cf_org_name
  name     = var.cf_space_name
}

# - services

resource "cloudfoundry_service_instance" "service_account" {
  name         = "ttasmarthub-deployer"
  space        = data.cloudfoundry_space.space.id
  service_plan = data.cloudfoundry_service.service_account.service_plans["space-deployer"] # ?
}

resource "cloudfoundry_user_provided_service" "uev_key" { # ?
  name  = "federalist-${var.env}-uev-key"
  space = data.cloudfoundry_space.space.id
  credentials = {
    key = var.uev_key # ?
  }
}

resource "cloudfoundry_route" "builder" { # ?
  domain   = data.cloudfoundry_domain.fr.id
  space    = data.cloudfoundry_space.space.id
  hostname = "federalist-builder-${var.env}"
}

###
# Application database
###

resource "cloudfoundry_service_instance" "database" {
  name         = "ttasmarthub-${var.env}"
  space        = data.cloudfoundry_space.space.id
  service_plan = data.cloudfoundry_service.rds.service_plans["medium-psql"]
}
