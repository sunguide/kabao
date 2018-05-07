'use strict';
const Controller = require('egg').Controller;

class APIController extends Controller {
  async index() {
    this.ctx.body = "API IS OK";
  }
  async banks(){
    let banks = await this.ctx.model.Bank.find();
    console.log(banks.length);
    this.ctx.body = {'banks':banks};
  }
  async crawler(){
    await this.ctx.service.crawler.crawlerStart();
    this.ctx.body = "ok";
  }

  async billUpdate(){
    let user = await this.ctx.model.User.findOne({id:1});
    console.log(user);
    let emails = await this.ctx.service.bill.getRecent30DayBills(user);
    this.ctx.body = emails;
  }
  async test(){
    console.log('test')
    const bcrypt = require("bcrypt");
    const match = await this.ctx.helper.checkPassword("sssssssdddddd", await this.ctx.helper.password('sssssssdddddd'));

    if(match) {
      //login
      console.log("success");
    }

    // this.ctx.body = await this.ctx.service.mail.getAllInboxFolder();
    // this.ctx.body = await this.ctx.service.mail.search("其他文件夹/myolder");
  }
}

module.exports = APIController;
