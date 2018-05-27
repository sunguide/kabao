'use strict';
const Controller = require('egg').Controller;
class controller extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      bank_id: {type: 'string'},
      card_number: {type: 'string'},
      statement_date: {type: 'string'},//账单日
      payment_date: {type: 'string', required: false}, //到期还款日
      credit_limit: {type: 'string'}, //信用额度
      currency: {type: 'string', required: false}, //货币单位
      valid_thru: {type: 'string'},//有效日期
    };
  }

  async index() {
    const {ctx} = this;
    this.ctx.body = await this.ctx.service.userCard.list({
      page: ctx.query.page,
      limit: ctx.query.limit,
      user_id: ctx.query.user_id,
    });
  }

  async show() {
    const {ctx} = this;

    ctx.body = await this.ctx.service.userCard.find({
      id: ctx.params.id
    });
  }

  async create() {
    const {ctx, service} = this;
    // 校验参数
    ctx.validate(this.createRule);
    console.log(ctx.request.body);
    await ctx.service.userCard.add(1, ctx.request.body);
    ctx.body = ctx.request.body;
  }

  async update() {
    const {ctx} = this;
    const id = ctx.params.id;

    ctx.validate(this.createRule);
    await ctx.service.userCard.update(Object.assign({id}, ctx.request.body));
    ctx.status = 204;
  }
}

module.exports = controller;