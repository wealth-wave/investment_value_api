import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';
import * as jsonpath from 'jsonpath';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { investment_code, investment_source, investment_type } = event.queryStringParameters;

  let url, jsonPath;
  switch (investment_source) {
    case 'source1':
      url = `https://source1.com/api/${investment_code}/${investment_type}`;
      jsonPath = '$.path.to.investmentValue'; // Replace with the actual JSON path for source1
      break;
    case 'source2':
      url = `https://source2.com/api/${investment_code}/${investment_type}`;
      jsonPath = '$.different.path.to.investmentValue'; // Replace with the actual JSON path for source2
      break;
    // Add more cases as needed
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid investment source' }),
      };
  }

  try {
    const response = await axios.get(url);
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