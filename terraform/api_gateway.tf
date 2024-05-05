resource "aws_api_gateway_rest_api" "investment_api" {
  name        = "investment_api"
  description = "REST API for Investment Lambda function"
}

resource "aws_api_gateway_resource" "investment_resource" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  parent_id   = aws_api_gateway_rest_api.investment_api.root_resource_id
  path_part   = "investment_value"
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

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.investment_api_lambda.invoke_arn
}

resource "aws_api_gateway_method" "investment_options" {
  rest_api_id   = aws_api_gateway_rest_api.investment_api.id
  resource_id   = aws_api_gateway_resource.investment_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "investment_options_integration" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  resource_id = aws_api_gateway_resource.investment_resource.id
  http_method = aws_api_gateway_method.investment_options.http_method

  type                    = "MOCK"
  passthrough_behavior    = "WHEN_NO_MATCH"
  request_templates       = { "application/json" = "{\"statusCode\": 200}" }
}

resource "aws_api_gateway_method_response" "investment_options_200" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  resource_id = aws_api_gateway_resource.investment_resource.id
  http_method = aws_api_gateway_method.investment_options.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true,
  }
}

resource "aws_api_gateway_integration_response" "investment_options_200" {
  rest_api_id = aws_api_gateway_rest_api.investment_api.id
  resource_id = aws_api_gateway_resource.investment_resource.id
  http_method = aws_api_gateway_method.investment_options.http_method
  status_code = aws_api_gateway_method_response.investment_options_200.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
  }
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
  value = "https://${aws_api_gateway_rest_api.investment_api.id}.execute-api.${var.region}.amazonaws.com/${aws_api_gateway_deployment.investment_deployment.stage_name}/${aws_api_gateway_resource.investment_resource.path_part}"
}