# Secrets to be provided via environment variables or
# in `secrets.auto.tfvars.` When provided via environment
# variables, the names must be prefixed with `TF_VAR_`
# Ex. `TF_VAR_cf_user="foobarbaz"`

variable "cf_api_url" {
  type        = string
  description = "cloud.gov api url"
  default     = "https://api.fr.cloud.gov"
}

variable "cf_org_name" {
  type        = string
  description = "cloud.gov organization name"
  default     = "hhs-acf-prototyping"
}

variable "cf_password" {
  type        = string
  description = "secret cloud.gov deployer account password"
}

variable "cf_space_name" {
  type        = string
  description = "cloud.gov space name"
  default     = "ohstta-dev"
}

variable "cf_user" {
  type        = string
  description = "secret cloud.gov deployer account user"
}

variable "env" {
  type        = string
  description = "deployment environment"
  default     = "dev"
}
