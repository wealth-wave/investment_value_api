import axios from "axios";
import InvestmentValueFetcher from "./investment_value_fetcher";

export default class IndianMutualFundValueFetcher implements InvestmentValueFetcher {

    constructor(private investment_code: string) { }

    async getValue(): Promise<number> {
        const url = `https://api.mfapi.in/mf/${this.investment_code}/latest`;
        const response = await axios.get(url, {});
        return response.data['data'][0]['nav'];
    }
}