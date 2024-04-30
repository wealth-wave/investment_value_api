import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import * as jsonpath from 'jsonpath';
import { SecretsManager } from 'aws-sdk';
import { InvestmentSourceConfig } from './config';


const secretsManager = new SecretsManager();

export const handler: APIGatewayProxyHandler = async (event) => {
    const { investment_code, investment_source, investment_type } = event.queryStringParameters as { investment_code: string, investment_source: string, investment_type: string };

    const sourceConfig = InvestmentSourceConfig[investment_source];
    if (!sourceConfig) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid investment source' }),
        };
    }

    const url = `${sourceConfig.url}/${investment_code}/${investment_type}`;
    const jsonPath = sourceConfig.jsonPath;
    let headers;
    if (sourceConfig.secretId) {
        const secret = await secretsManager.getSecretValue({ SecretId: sourceConfig.secretId }).promise();
        headers = { 'Authorization': `Bearer ${secret.SecretString}` };
    }

    try {
        const response = await axios.get(url, { headers });
        const investmentValue = jsonpath.query(response.data, jsonPath)[0];

        return {
            statusCode: 200,
            body: JSON.stringify({ investmentValue }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving investment value' }),
        };
    }
};