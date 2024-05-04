import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import { JSONPath } from 'jsonpath-plus';
import { InvestmentSource } from './config';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { investment_code, investment_source } = event.queryStringParameters ?? {} as { investment_code?: string, investment_source?: InvestmentSource };

        if (investment_source === InvestmentSource.mutual_fund_india) {
            const url = `https://api.mfapi.in/mf/${investment_code}/latest`;
            const response = await axios.get(url, {});
            const investmentValue = JSONPath({ path: 'data.0.nav', json: response.data })[0];
            return {
                statusCode: 200,
                body: JSON.stringify({ value: investmentValue }),
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