import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { InvestmentSource } from './investment_source';
import getFetcher from './investment_value_fetcher/investment_value_fetcher_factory';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { investment_code, investment_source } = event.queryStringParameters ?? {} as { investment_code?: string, investment_source: InvestmentSource };
        const investment_source_value = InvestmentSource[investment_source as keyof typeof InvestmentSource];
        const investmentValueFetcher = getFetcher(investment_source_value, investment_code);
        const investmentValue = await investmentValueFetcher.getValue();
        return {
            statusCode: 200,
            body: JSON.stringify({ value: investmentValue }),
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error }),
        };
    }
};