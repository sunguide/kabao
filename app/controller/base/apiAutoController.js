'use strict';
const Controller = require('egg').Controller;
//自动化API控制器基类
class apiAutoController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {};
    this.updateRule = {};
    this.showRule = {};
    this.indexRule = {};
    this.destoryRule = {};
    this.code = 200;
  }

  async index() {
    const {ctx} = this;
    let query = ctx.request.query;
    let page = query.page = parseInt(query.page) || 1;
    let limit = query.limit = parseInt(query.limit)  || 10;
    let list = await ctx.service.model.index(this.modelName, query);
    let total = await ctx.service.model.count(this.modelName, query)
    this.setData({
      list,
      page,
      limit,
      total,
    });
    this.response();
  }

  async show() {
    let params = {id:this.ctx.params.id};
    let data = await this.ctx.service.model.show(this.modelName, params);
    this.setData(data);
    this.response();
  }

  async create() {
    const {ctx, service} = this;
    // 校验参数
    ctx.validate(this.createRule);
    let params = ctx.request.body;
    let data = await this.ctx.service.model.create(this.modelName, params);
    this.setData(data);
    this.response();
  }

  async update() {
    const {ctx} = this;
    const id = ctx.params.id;
    ctx.validate(this.updateRule);
    let data = await ctx.service.model.update(this.modelName, Object.assign({id}, ctx.request.body));
    this.setData(data);
    this.response();
  }

  async destory(){
    const {ctx} = this;
    let params = {id:this.params.id};
    let data = await ctx.service.model.destory(this.modelName, params);
    this.setData(data);
    this.response();
  }

  setData(data){
    this.data = data;
  }

  response(){
    this.ctx.body = {
      code: this.code,
      data: this.data,
      message: ""
    }
  }
}

module.exports = apiAutoController;
