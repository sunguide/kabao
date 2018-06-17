'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {

  //mcc查询工具入口
  async index(){
    await this.ctx.render('mcc/index.tpl');
  }

  //mcc银行积分快速入口
  async point(){
    await this.ctx.render('mcc/point.tpl');
  }
}

module.exports = controller;