'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      bank_id: { type: 'string' },
      card_number: { type: 'string' }
    };
  }
  async addCard(){
    const { ctx, service } = this;
    const createRule = {
      bank_id: { type: 'string' },
      card_number: { type: 'string' },
    };
    // 校验参数
    ctx.validate(this.createRule);
    console.log(ctx.request.body);
    this.ctx.body = ctx.request.body;
    let card = {
      bank_id:ctx.request.body.bank_id,
      card_id: {type: Number, index: true},
      card_number: {type: String, index: true},
      statement_date: {type: Number},//账单日
      payment_date: {type: Number}, //到期还款日
      credit_limit: {type: Number}, //信用额度
      rewards_points_balance: {type: Number, default:0}, //积分余额
      currency:{type: String}, //货币单位
      valid_thru:{type: Number},//有效日期
    }
  }

  async update() {
    const { ctx } = this;
    const id = ctx.params.id;

    ctx.validate(this.createRule);
    await ctx.service.topics.update(Object.assign({ id }, ctx.request.body));
    ctx.status = 204;
  }
}

module.exports = controller;