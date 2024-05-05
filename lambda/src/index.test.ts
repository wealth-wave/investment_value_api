import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import context from 'aws-lambda-mock-context';
import axios from 'axios';
import { handler } from './index';

jest.useFakeTimers();
jest.mock('axios');
jest.mock('aws-sdk', () => {
  return {
    SecretsManager: jest.fn(() => ({
      getSecretValue: jest.fn().mockImplementation((params) => {
        return {
          promise: jest.fn().mockResolvedValue({ SecretString: 'test-api-key' }),
        };
      }),
    })),
  };
});

const ctx = context();

describe('handler', () => {

  beforeEach(() => {
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the investment value for a indian mutual fund', async () => {
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

  it('returns the investment value for a valid US stock', async () => {
    const mockedStockResponse = {
      data: {
        'Global Quote': {
          '05. price': '150.00'
        }
      }
    };
    const mockedExchangeResponse = {
      data: {
        'Realtime Currency Exchange Rate': {
          '5. Exchange Rate': '75.00'
        }
      }
    };
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedStockResponse).mockResolvedValueOnce(mockedExchangeResponse);

    const event: Partial<APIGatewayProxyEvent> = {
      queryStringParameters: {
        investment_code: 'AAPL',
        investment_source: 'stock_us'
      },
      body: JSON.stringify({})
    };

    const result: APIGatewayProxyResult | void = await handler(event as APIGatewayProxyEvent, ctx, () => { return; });
    if (result) {
      expect(result.statusCode).toBe(200);
      expect(result.headers).toHaveProperty('Content-Type', 'application/json');
      expect(typeof result.body).toBe('string');

      const body = JSON.parse(result.body);
      expect(body).toEqual({ value: 150.00 * 75.00 }); // Check the returned investment value
    } else {
      fail('Expected a result but received void');
    }
  });

  it('returns the investment value for gold', async () => {
    const mockedResponse = { data: { price: 123.45 } };
    jest.spyOn(axios, 'get').mockResolvedValueOnce(mockedResponse);

    const event: Partial<APIGatewayProxyEvent> = {
      queryStringParameters: {
        investment_source: 'gold'
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