###
# State management
###

terraform {
  backend "s3" {
    bucket         = "ohs-terraform-state"
    key            = "terraform.tfstate.dev"
    dynamodb_table = "ohs-terraform-lock"
    encrypt        = true
  }
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
