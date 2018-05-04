'use strict';
const Controller = require('egg').Controller;

class CrawlerController extends Controller {

  async fetchBanks(){
    await this.ctx.service.crawler.fetchBanks(this.ctx);
    this.ctx.body = "ok"
  }
}

module.exports = CrawlerController;
