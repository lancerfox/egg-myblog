'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcrypt');
const createToken = require('../token/createToken');
class MobileUserController extends Controller {
  // 登录
  async login() {
    const { ctx, service } = this;
    // 查询用户名是否已经存在
    const { username, password } = ctx.request.body;
    const val = await service.user.find({ username });
    console.log(val);
    if (val === null) {
      ctx.body = {
        message: '用户不存在！',
        error: 1,
      };
      ctx.status = 200;
    } else {
      const pwdMatchFlag = await bcrypt.compareSync(password, val.password);
      if (pwdMatchFlag) {
        const _token = await createToken(password); // 创建token
        ctx.cookies.set('token', _token); // 设置cookice
        ctx.body = {
          message: '登录成功！',
          token: _token,
          username: val.username,
          userid: val.id,
          error: 0,
        };
        ctx.status = 200;
      } else {
        ctx.body = {
          message: '用户名或密码错误，请重新输入！',
          error: 1,
        };
        ctx.status = 200;
      }
    }
  }
  // 注册
  async signin() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    // 查询用户名是否已经存在
    const val = await service.user.find({ username });
    // 验证参数类型
    const createRule = {
      username: { type: 'string' },
      password: { type: 'string' },
    };
    try {
      ctx.validate(createRule, {
        username,
        password,
      });
    } catch (err) {
      ctx.logger.warn(err.errors[0].field);
      const ErrorArr = [];

      for (let i = 0; i < err.errors.length; i++) {
        ErrorArr.push(err.errors[i].field);
      }
      ctx.body = {
        message: ErrorArr + '类型无效！',
        error: 1,
      };
      ctx.status = 200;
    }
    if (val === null) {
      // 创建用户
      const res = await service.user.create(ctx.request.body);
      if (res.result.affectedRows === 1) {
        ctx.body = {
          message: '注册成功！',
          error: 0,
        };
        ctx.status = 200;
      } else {
        ctx.body = {
          message: '注册失败！',
          error: 0,
        };
        ctx.status = 200;
      }
    } else {
      const username = val.username;
      if (username === ctx.request.body.username) {
        ctx.body = {
          message: '用户名已经存在！',
          error: 0,
        };
        ctx.status = 200;
      }
    }
  }
}

module.exports = MobileUserController;
