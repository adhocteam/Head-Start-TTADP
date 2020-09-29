variable "cg_api_url" {  # was cf_api_url
  type        = string
  description = "cloud.gov api url"
}

variable "cg_org_name" {  # was org_name
  type        = string
  description = "cloud.gov organization name"
}

# Secrets to be provided via environment variables or in `secrets.auto.tfvars.`
# When provided via environment variables, the names must be prefixed with `TF_VAR_`
# Ex. `TF_VAR_cf_user="foobarbaz"`
variable "access_key" {
  type        = string
  description = "AWS access key id"
}

variable "secret_key" {
  type        = string
  description = "AWS secret access key"
}

# does this really need to be secret?
variable "region" {
  type        = string
  description = "AWS default region"
}

variable "cg_user" {  # was cf_user
  type        = string
  description = "cloud.gov deployer account user"
}

variable "cg_password" {  # was cf_password
  type        = string
  description = "cloud.gov deployer account password"
}
