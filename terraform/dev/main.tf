###
# State management
###

terraform {
  backend "s3" {
    bucket         = "ohs-terraform-state"
    key            = "terraform.tfstate.dev"
    encrypt        = true
  }
}

###
# Cloud Foundry infrastructure
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
  service_plan = data.cloudfoundry_service.service_account.service_plans["space-deployer"]
}

resource "cloudfoundry_service_instance" "database" {
  name         = "ttasmarthub-${var.env}"
  space        = data.cloudfoundry_space.space.id
  service_plan = data.cloudfoundry_service.rds.service_plans["medium-psql"]
}
