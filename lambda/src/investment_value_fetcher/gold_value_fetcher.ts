import axios from "axios";
import { getApiKey } from "../secret_utils";
import InvestmentValueFetcher from "./investment_value_fetcher";

export default class GoldValueFetcher implements InvestmentValueFetcher {

    constructor() { }

    async getValue(): Promise<number> {
        const apiKey = await getApiKey('gold_api_key');
        const response = await axios.get('https://www.goldapi.io/api/XAU/INR', {
            headers: {
                'x-access-token': apiKey
            }
        });
        return response.data['price'];
    }
}