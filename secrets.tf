variable "alpha_vantage_api_key" {
  description = "Alpha Vantage Stock API Key"
}

variable "another_secret_key" {
  description = "Another Secret Key"
}

resource "aws_secretsmanager_secret" "alpha_vantage_api_key" {
  name        = "alpha_vantage_api_key"
  description = "Alpha Vantage Stock API Key"
}

resource "aws_secretsmanager_secret_version" "alpha_vantage_api_key" {
  secret_id     = aws_secretsmanager_secret.alpha_vantage_api_key.id
  secret_string = var.alpha_vantage_api_key
}

resource "aws_secretsmanager_secret" "another_secret" {
  name        = "another_secret"
  description = "Another Secret"
}

resource "aws_secretsmanager_secret_version" "another_secret" {
  secret_id     = aws_secretsmanager_secret.another_secret.id
  secret_string = var.another_secret_key
}