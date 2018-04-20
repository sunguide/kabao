'use strict';
const cheerio = require("cheerio");
const request = require("superagent");
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {

    let res = await request.get("https://kaku.51credit.com/tag/310100index.html");
    console.log(res)
    let $ = cheerio.load(res.text);
    let banks = [];
    $('#bank_all a').each(function (i,item) {
      let bank = {
        "id":$(item).attr("id"),
        "small_img":$(item).find("img").attr("src"),
        "name":$(item).find("em").text()
      };
      banks.push(bank);
    });
    console.log(banks.length)
    this.ctx.body = banks;
  }
}

module.exports = HomeController;
