import axios from "axios";
import { getApiKey } from "../secret_utils";
import InvestmentValueFetcher from "./investment_value_fetcher";

export default class USStockValueFetcher implements InvestmentValueFetcher {

    constructor(private investment_code: string) { }

    async getValue(): Promise<number> {
        const apiKey = getApiKey('alpha_vantage_api_key_1');
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.investment_code}&apikey=${apiKey}`;
        const stockResponse = await axios.get(url, {});
        const investmentValue = stockResponse.data['Global Quote']['05. price'];

        const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${apiKey}`;
        const exchangeResponse = await axios.get(exchangeRateUrl, {});
        const exchangeRate = exchangeResponse.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];

        return investmentValue * exchangeRate;
    }
}