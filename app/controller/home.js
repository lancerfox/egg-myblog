'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      data: '200',
    };
    this.ctx.status = 200;
  }
  async admin() {
    await this.ctx.render('../view/index.html');
  }
}

module.exports = HomeController;
