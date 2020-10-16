# Secrets to be provided via environment variables or
# in `secrets.auto.tfvars.` When provided via environment
# variables, the names must be prefixed with `TF_VAR_`
# Ex. `TF_VAR_cf_user="foobarbaz"`

variable "cf_api_url" {
  type        = string
  description = "cloud.gov api url"
  default     = "https://api.fr.cloud.gov"
}

variable "cf_password" {
  type        = string
  description = "secret cloud.gov deployer account password"
}


variable "cf_user" {
  type        = string
  description = "secret cloud.gov deployer account user"
}
