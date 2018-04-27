'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    let banks = await this.ctx.service.crawler.getCreditCards();
    console.log(banks.length);

    let creditCard = await this.ctx.service.crawler.getCreditCardSeriesInfo('https://credit.u51.com/kaku/s-12442');
    creditCard = await this.ctx.service.crawler.getCreditCardInfo('https://credit.u51.com/kaku/12288.html#');
    this.ctx.body = creditCard;
  }
}

module.exports = HomeController;
