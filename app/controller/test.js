'use strict';
const Controller = require('egg').Controller;
const request = require("superagent");
class controller extends Controller {

  async fetchBanks(){
    let creditCard = await this.ctx.service.crawler.getCreditCardSeriesInfo('https://credit.u51.com/kaku/s-12442');
    creditCard = await this.ctx.service.crawler.getCreditCardInfo('https://credit.u51.com/kaku/12288.html#');
    this.ctx.body = creditCard;
  }

  async fetchPage(){
    let URL = require('url');
    let url = "http://preview.webpixels.io/boomerang-v3.6/demos/startup-analitycs/";
    let urlParsed = URL.parse(url);
    let filePath = urlParsed.path;
    let filePathName = urlParsed.pathname;
    if(filePath === filePathName){
      filePathName = filePath + "/index.html";
    }
    filePath = "." + filePath;
    filePathName = "." + filePathName;

    let html = await this.ctx.curl(url);


    console.log(urlParsed)
    this.body = html;

  }
}

module.exports = controller;