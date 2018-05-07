'use strict';
const cheerio = require('cheerio');
const fs = require('fs');
const bank_rules = require('../../data/bank/index.js');
module.exports = app => {
    class bill extends app.Service {
        constructor(ctx) {
            super(ctx);
        }
        async getRecent30DayBills(user) {
          let emails = await this.ctx.service.mail.getAllInboxMails(user, 31);
          let $this = this;
          for(let i = 0; i < emails.length; i++){
            console.log(emails);
            for(let key in bank_rules){
              if(emails[i].from.text.indexOf(bank_rules[key].email) > -1){
                fs.writeFile(bank_rules[key].email + '.html', emails[i].html);
                $this.analyze(emails[i].html, bank_rules[key]);
              }
            }
          }
        }

        async analyze(html,rule){
          let $ = cheerio.load(html,{decodeEntities: false});
          let map = rule.map;
          console.log(html);
          let bill = {};
          for(let key in map){
            bill[key] = map[key] !== "" ? $(map[key]).text():"";
          }
          if(rule.bill_handle_map){
            for(let key in rule.bill_handle_map){
              bill[key] = rule.bill_handle_map[key](bill[key]);
            }
          }
          this.save(bill);
        }

        async save(data){
          data['statement_date'] = this.ctx.helper.formatBillDate(data['statement_date']);
          data['payment_date'] = this.ctx.helper.formatBillDate(data['payment_date']);
          data['credit_limit'] = this.ctx.helper.currencyParse(data['credit_limit']).amount;
          data['current_amount_due'] = this.ctx.helper.currencyParse(data['current_amount_due']).amount;
          data['minimum_amount_ue'] = this.ctx.helper.currencyParse(data['minimum_amount_ue']).amount;
          // data['rewards_points_balance'] = data['rewards_points_balance'];
          data['currency'] = this.ctx.helper.currencyParse(data['credit_limit']).currency;
          console.log(data);
          return await (new this.ctx.model.Bill(data)).save();
        }
    }

    return bill;
};
