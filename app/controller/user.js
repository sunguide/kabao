'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {

  async profile(){
    await this.ctx.render('user/profile.tpl');
  }

  async addCard(){
    const { ctx, service } = this;
    const createRule = {
      title: { type: 'string' },
      content: { type: 'string' },
    };
    // 校验参数
    ctx.validate(createRule);
  }
}

module.exports = controller;