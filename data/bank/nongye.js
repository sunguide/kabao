module.exports = {
  email:"e-statement@creditcard.abchina.com",
  bill_map: {
    "statement_date":"#fixBand15 > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(5) > div > font",
    "payment_date":"#fixBand15 > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(7) > div > font",
    "credit_limit":"#fixBand3 > table > tbody > tr > td > table > tbody > tr > td:nth-child(5) > div",
    "current_amount_due":"#fixBand3 > table > tbody > tr > td > table > tbody > tr > td:nth-child(3) > div > font",
    "minimum_amount_ue":"#fixBand3 > table > tbody > tr > td > table > tbody > tr > td:nth-child(4) > div > font",
    "rewards_points_balance":"#fixBand9 > table > tbody > tr > td > table > tbody > tr > td > div > font",
  },
  bill_handle_map:{
    "statement_date":function (str) {
        if(typeof str === 'string' && str.indexOf('-') > 0){
            return str.split("-")[1];
        }
        return str;
    }
  }
};