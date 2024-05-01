resource "aws_api_gateway_rest_api" "investment_api" {
  name        = "investment_api"
  description = "REST API for Investment Lambda function"
}

resource "aws_api_gateway_resource" "investment_resource" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  parent_id   = aws_api_gateway_rest_api.investment_api.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "investment_method" {
  rest_api_id   = aws_api_gateway_rest_api.investment_api.id
  resource_id   = aws_api_gateway_resource.investment_resource.id
  http_method = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "investment_integration" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  resource_id = aws_api_gateway_resource.investment_resource.id
  http_method = aws_api_gateway_method.investment_method.http_method

  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.investment_api_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "investment_deployment" {
  depends_on = [aws_api_gateway_integration.investment_integration]

  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  stage_name  = "prod"
  description = "Deployed at ${timestamp()}"
}

resource "aws_lambda_permission" "investment_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.investment_api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.investment_api.execution_arn}/*/*"
}

output "url" {
  value = "https://${aws_api_gateway_rest_api.investment_api.id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_deployment.investment_deployment.stage_name}"
}