# what I think should be in a main file

terraform {
  backend "s3" {
    bucket         = "ohs-ttasmarthub-terraform-state"
    key            = "terraform.tfstate.dvp-dev"
    dynamodb_table = "dsva-shared-terraform-lock"
    region         = "us-gov-west-1"
    encrypt        = true
  }
}

provider "aws" {
  version = ">= 2.70.0"
  region  = "us-gov-west-1"  # how do they never actually supply a region
}

variable "base_tags" {
  default = {
    environment  = "dev"
  }
}

# from federalist-infra/terraform/dev/providers.tf

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region
}

provider "cloudfoundry" {
  api_url      = var.cg_api_url
  user         = var.cg_user
  password     = var.cg_password
  app_logs_max = 30
}


# from federalist-infra/terraform/dev/main.tf

# discovers the region of the provider, so you still have to set region in provider
data "aws_region" "current" {}

data "cloudfoundry_space" "space" {
  org_name = var.cg_org_name
  name     = var.base_tags["env"]
}

data "cloudfoundry_domain" "fr" {
  name = "fr.cloud.gov"
}

data "cloudfoundry_service" "rds" {
  name = "aws-rds"
}

# data "cloudfoundry_service" "redis" {
#   name = "redis32"
# }

data "cloudfoundry_service" "service_account" {
  name = "cloud-gov-service-account"
}

resource "cloudfoundry_service_instance" "database" {
  name         = "federalist-${var.env}-rds"
  space        = data.cloudfoundry_space.space.id
  service_plan = data.cloudfoundry_service.rds.service_plans["medium-psql"]
}

# resource "cloudfoundry_service_instance" "redis" {
#   name         = "federalist-${var.env}-redis"
#   space        = data.cloudfoundry_space.space.id
#   service_plan = data.cloudfoundry_service.redis.service_plans["standard-ha"]
# }

resource "cloudfoundry_service_instance" "service_account" {
  name         = "federalist-deploy-user"
  space        = data.cloudfoundry_space.space.id
  service_plan = data.cloudfoundry_service.service_account.service_plans["space-deployer"]
}

resource "cloudfoundry_user_provided_service" "uev_key" {
  name  = "federalist-${var.env}-uev-key"
  space = data.cloudfoundry_space.space.id
  credentials = {
    key = var.uev_key
  }
}

# module "queue" {
#   source = "../modules/queue"

#   aws_user_name = "federalist-${var.env}-sqs"
#   space         = data.cloudfoundry_space.space.id
#   service_name  = "federalist-${var.env}-sqs-creds"
#   aws_region    = data.aws_region.current.name

#   tags = {
#     Environment = var.env
#   }
# }

resource "cloudfoundry_route" "builder" {
  domain   = data.cloudfoundry_domain.fr.id
  space    = data.cloudfoundry_space.space.id
  hostname = "federalist-builder-${var.env}"
}
