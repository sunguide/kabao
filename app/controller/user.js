'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {

  async profile(){
    await this.ctx.render('user/profile.tpl');
  }

  async cards(){
    await this.ctx.render('user/cards.tpl');
  }
}

module.exports = controller;