'use strict';
const Controller = require('../base/apiAutoController');
class controller extends Controller {
  constructor(ctx) {
    super(ctx);
  }
  async index(){
    const {ctx, app} = this;
    const results = await app.mysql.select('kb_mcc',{
      orders: [['id','desc']],
      limit: 10,
      offset: 0
    });
    this.setData(results);
    this.response();
  }


  async show() {
    const {ctx, app} = this;
    const params = {
      mcc: ctx.params.id
    };
    const result = await app.mysql.get('kb_mcc', params);
    this.setData(result);
    this.response();
  }
}

module.exports = controller;