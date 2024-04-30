# Investment Value API

This project contains a lambda function to fetch investment values from different sources.

## Setup

1. Rename `env.sh.template` to `env.sh` and update it with your actual secret keys.

```bash
mv env.sh.template env.sh
tsc index.ts
```

2. Open env.sh and replace "your_alpha_vantage_api_key" and "your_another_secret_key" with your actual secret keys.

```bash
export TF_VAR_alpha_vantage_api_key="your_alpha_vantage_api_key"
export TF_VAR_another_secret_key="your_another_secret_key"
```

3. Source the environment variables file before running Terraform commands:
```bash
source env.sh
```

## Deployment
To deploy the lambda function, run the following command:

```bash
terraform apply
```
This will create the necessary AWS resources and deploy the lambda function.

## Usage
You can invoke the lambda function with an HTTP GET request. The request should include query parameters for the investment code, investment source, and investment type.

For example:
```bash
curl "https://your-api-gateway-url.com/prod?investment_code=abc&investment_source=source1&investment_type=type1"
```

Replace "https://your-api-gateway-url.com/prod" with your actual API Gateway URL.