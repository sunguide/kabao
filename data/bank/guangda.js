module.exports = {
  email:"cebbank@cardcenter.cebbank.com",
  bill_map: {
    "statement_date":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(1)",
    "payment_date":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)",
    "credit_limit":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(3)",
    "current_amount_due":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(4)",
    "minimum_amount_ue":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(5)",
    "rewards_points_balance":"body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(6)",
  }
};

