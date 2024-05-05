import { InvestmentSource } from "../investment_source";
import GoldValueFetcher from "./gold_value_fetcher";
import IndianMutualFundValueFetcher from "./indian_mutual_fund_fetcher";
import InvestmentValueFetcher from "./investment_value_fetcher";
import USStockValueFetcher from "./us_stock_value_fetcher";

export default function getFetcher(investment_source: InvestmentSource, investment_code?: string): InvestmentValueFetcher {
    if (investment_source === InvestmentSource.stock_us) {
        return new USStockValueFetcher(investment_code ?? '');
    } else if (investment_source === InvestmentSource.mutual_fund_india) {
        return new IndianMutualFundValueFetcher(investment_code ?? '');
    } else if (investment_source === InvestmentSource.gold) {
        return new GoldValueFetcher();
    } else {
        throw new Error('Invalid investment source');
    }
}