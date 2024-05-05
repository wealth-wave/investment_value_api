# Investment Value API

This project contains a lambda function to fetch investment values from different sources.

## Setup

1. Rename `.env.template` to `.env` and update it with your actual secret keys.

## Deployment
To deploy the lambda function, run the following command:

```bash
npm --prefix ./lambda run release && source .env && terraform -chdir=terraform apply
```
This will create the necessary AWS resources and deploy the lambda function.

## Usage
You can invoke the lambda function with an HTTP GET request. The request should include query parameters for the investment code, investment source, and investment type.

For example:
```bash
curl "https://your-api-gateway-url.com/prod/investment_api?investment_code=abc&investment_source=source1"
```
