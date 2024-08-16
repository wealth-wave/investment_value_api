resource "aws_secretsmanager_secret" "alpha_vantage_api_key_1" {
  name        = "alpha_vantage_api_key_1"
  description = "Alpha Vantage Stock API Key"
}

resource "aws_secretsmanager_secret_version" "alpha_vantage_api_key_1" {
  secret_id     = aws_secretsmanager_secret.alpha_vantage_api_key_1.id
  secret_string = var.alpha_vantage_api_key
}

resource "aws_secretsmanager_secret" "gold_api_key" {
  name        = "gold_api_key"
  description = "Gold metal API Key"
}

resource "aws_secretsmanager_secret_version" "gold_api_key" {
  secret_id     = aws_secretsmanager_secret.gold_api_key.id
  secret_string = var.gold_api_key
}
