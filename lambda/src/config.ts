export const InvestmentSourceConfig = {
    mutual_fund_india: {
      url: 'https://api.mfapi.in/mf/:fundId/latest',
      jsonPath: 'data.0.nav',
    },
    stock_us: {
      url: 'https://source2.com/api',
      jsonPath: '$.different.path.to.investmentValue',
      secretId: 'source2ApiToken',
    },
  };