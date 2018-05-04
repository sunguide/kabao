'use strict';
const Controller = require('egg').Controller;

class APIController extends Controller {
  async index() {
    this.ctx.body = "API IS OK";
  }
  async banks(){
    let banks = await this.ctx.service.crawler.getCreditBanks();
    let banks1 = await this.ctx.service.crawler.getBanks();
    console.log(banks.length);
    this.ctx.body = {'banks':banks,'banks1':banks1};
  }
  async crawler(){
    await this.ctx.service.crawler.crawlerStart();
    this.ctx.body = "ok";
  }

  async billUpdate(){
    let emails = await this.ctx.service.mail.getRecentEmails(60);
    this.ctx.body = emails;
  }
  async test(){
    await this.ctx.service.mail.search();
    this.ctx.body = "ok"
  }
}

module.exports = APIController;
