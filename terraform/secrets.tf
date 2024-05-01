resource "aws_secretsmanager_secret" "alpha_vantage_api_key_1" {
  name        = "alpha_vantage_api_key_1"
  description = "Alpha Vantage Stock API Key"
}

resource "aws_secretsmanager_secret_version" "alpha_vantage_api_key_1" {
  secret_id     = aws_secretsmanager_secret.alpha_vantage_api_key_1.id
  secret_string = var.alpha_vantage_api_key
}