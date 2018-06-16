'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {


  async index(){
    await this.ctx.render('mcc/index.tpl');
  }
}

module.exports = controller;