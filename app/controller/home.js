'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    let creditCard = await this.ctx.service.crawler.getCreditCardSeriesInfo('https://credit.u51.com/kaku/s-12442');
    creditCard = await this.ctx.service.crawler.getCreditCardInfo('https://credit.u51.com/kaku/12443.html#');
    this.ctx.body = creditCard;
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
}

module.exports = HomeController;
