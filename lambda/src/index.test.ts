import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import context from 'aws-lambda-mock-context';
import axios from 'axios';
import { handler } from './index';

jest.mock('axios');

const ctx = context();

describe('handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the investment value for a valid investment source', async () => {
    const mockedResponse = { data: { data: [{ nav: 123.45 }] } };
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    const event: Partial<APIGatewayProxyEvent> = {
      queryStringParameters: {
        investment_code: '123',
        investment_source: 'mutual_fund_india'
      },
      body: JSON.stringify({})
    };

    const result: APIGatewayProxyResult | void = await handler(event as APIGatewayProxyEvent, ctx, () => { return; });
    if (result) {
      expect(result.statusCode).toBe(200);
      expect(result.headers).toHaveProperty('Content-Type', 'application/json');
      expect(typeof result.body).toBe('string');

      const body = JSON.parse(result.body);
      expect(body).toEqual({ value: 123.45 });
    } else {
      fail('Expected a result but received void');
    }
  });
});