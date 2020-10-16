# Secrets to be provided via environment variables or
# in `secrets.auto.tfvars.` When provided via environment
# variables, the names must be prefixed with `TF_VAR_`
# Ex. `TF_VAR_cf_user="foobarbaz"`

variable "cf_org_name" {
  type        = string
  description = "cloud.gov organization name"
  default     = "hhs-acf-prototyping"
}

variable "cf_space_name" {
  type        = string
  description = "cloud.gov space name"
  default     = "ohstta-dev"
}

variable "env" {
  type        = string
  description = "deployment environment"
  default     = "dev"
}
