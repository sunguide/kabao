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
          // let emails = await this.ctx.service.mail.getTargetInboxMails(this.ctx.service.mail.getClient(user),"INBOX");

          let $this = this;
          for(let i = 0; i < emails.length; i++){
            let email = emails[i];
            let bill_type = 0;
            for(let key in bank_rules){
              if(emails[i].from.text.indexOf(bank_rules[key].email) > -1){
                fs.writeFile(email.from.text + Date.now()+ '.html', emails[i].html);
                // $this.analyze(emails[i].html, bank_rules[key]);
                bill_type = 1;
              }else if(email.subject.indexOf("信用卡")>-1 && email.subject.indexOf("账单")>-1){
                fs.writeFile(email.from.text + Date.now()+ '.html', emails[i].html);
                // $this.analyze(emails[i].html, bank_rules[key]);
                bill_type = 1;
              }else if(email.subject.indexOf("账单")>-1){
                fs.writeFile(email.from.text + Date.now()+ '.html', emails[i].html);
                // $this.analyze(emails[i].html, bank_rules[key]);
                bill_type = 2;
              }
            }

            let emailModel = {
              user_id: user.id,
              message_id:email.messageId,
              subject: email.subject,
              from: email.from.text,
              to: email.to.text,
              html: email.html ? email.html:'',
              text: email.html ? '':email.text,
              attachments: email.attachments,
              date: email.date,
              bill_type:bill_type
            };
            await (new this.ctx.model.UserEmail(emailModel)).save(function (err, doc) {
                if(err){
                  console.log(err);
                }
            });
            console.log("all:"+emails.length);
          }
          return "all:"+emails.length;
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
