import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import axios from 'axios';
import { InvestmentSource } from './config';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { investment_code, investment_source } = event.queryStringParameters ?? {} as { investment_code?: string, investment_source?: InvestmentSource };
        if (investment_source === InvestmentSource.mutual_fund_india) {
            const url = `https://api.mfapi.in/mf/${investment_code}/latest`;
            const response = await axios.get(url, {});
            const investmentValue = response.data['data'][0]['nav'];
            return {
                statusCode: 200,
                body: JSON.stringify({ value: investmentValue }),
                headers: { 'Content-Type': 'application/json' }
            };
        } else if (investment_source === InvestmentSource.stock_us) {
            const apiKey = getApiKey('alpha-vantage-api-key');
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investment_code}&apikey=${apiKey}`;
            const stockResponse = await axios.get(url, {});
            const investmentValue = stockResponse.data['Global Quote']['05. price'];

            const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${apiKey}`;
            const exchangeResponse = await axios.get(exchangeRateUrl, {});
            const exchangeRate = exchangeResponse.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            return {
                statusCode: 200,
                body: JSON.stringify({ value: investmentValue * exchangeRate }),
                headers: { 'Content-Type': 'application/json' }
            };
        } else {
            console.error(`Unsupported investment source: ${investment_source}`);
            throw new Error(`Unsupported investment source: ${investment_source}`);
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error }),
        };
    }
};


async function getApiKey(secretId: string): Promise<string> {
    try {
        const secretsManager = new SecretsManager();
        const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();
        return data.SecretString ?? '';
    } catch (error) {
        console.error(`Error retrieving secret: ${error}`);
        throw error;
    }
}