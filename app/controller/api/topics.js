'use strict';
const Controller = require('../base/apiAutoController');

class controller extends Controller {
  constructor(ctx) {
    super(ctx);
    this.modelName = "topic";
    this.createRule = {
      title: { type: 'string' },
      content: { type: 'string' }
    };
  }
}

module.exports = controller;