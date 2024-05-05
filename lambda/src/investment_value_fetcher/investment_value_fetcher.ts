export default interface InvestmentValueFetcher {
    getValue(): Promise<number>;
}
