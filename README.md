# Investment Value API

This project contains a lambda function to fetch investment values from different sources.

## Setup

1. Rename `env.sh.template` to `env.sh` and update it with your actual secret keys.

```bash
cd lambda
tsc index.ts
```


## Deployment
To deploy the lambda function, run the following command:

```bash
cd terraform
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