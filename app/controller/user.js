'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcrypt'); // 加密
const _utils = require('../utlis/utils.js');
const createToken = require('../token/createToken'); // 创建token
class UserController extends Controller {
  // 登录
  async login() {
    const { ctx, service } = this;
    // 查询用户名是否已经存在
    const { username, password } = ctx.request.body;

    if (_utils.isEmpty(username)) {
      ctx.body = {
        message: '请输入用户名！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    if (_utils.isEmpty(password)) {
      ctx.body = {
        message: '请输入密码！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const val = await service.user.find_user({ username });
    console.log(val);
    if (val === 0) {
      ctx.body = {
        message: '用户不存在！',
        error: 1,
      };
      ctx.status = 200;
    } else {
      // 解密判断
      const pwdMatchFlag = await bcrypt.compareSync(password, val.password);
      if (pwdMatchFlag) {
        const _token = await createToken(password); // 创建token
        ctx.cookies.set('token', _token, {
          httpOnly: false,
          signed: false,
        }); // 设置cookice
        ctx.cookies.set('uuid', val.id, {
          httpOnly: false,
          signed: false,
        }); // 设置cookice
        ctx.body = {
          message: '登录成功！',
          username: val.username,
          token: _token,
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
  // 创建用户
  async createUsers() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;

    // 验证参数类型
    const createRule = {
      username: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/,
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/,
      },
    };
    try {
      ctx.validate(createRule);
    } catch (err) {
      ctx.logger.warn(err.errors);
      const ErrorArr = [];
      for (let i = 0; i < err.errors.length; i++) {
        ErrorArr.push(err.errors[i].field);
      }
      ctx.body = {
        message:
          ErrorArr +
          '输入格式错误！' +
          ErrorArr +
          '只能输入5-20个以字母开头、可带数字、“_”、“.”的字符',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    // 查询用户名是否已经存在
    const val = await service.user.find_user({ username });
    // console.log(val)
    if (val === 0) {
      // 创建用户
      const res = await service.user.create(ctx.request.body);
      if (res.affectedRows === 1) {
        ctx.body = {
          message: '注册成功！',
          error: 0,
        };
        ctx.status = 200;
      } else {
        ctx.body = {
          message: '注册失败！',
          error: 1,
        };
        ctx.status = 200;
      }
    } else {
      const username = val.username;
      if (username === ctx.request.body.username) {
        ctx.body = {
          message: '用户名已经存在！',
          error: 1,
        };
        ctx.status = 200;
      }
    }
  }
  // 删除用户
  async delete() {
    const { ctx, service } = this;
    const _id = ctx.request.body.id;
    // 查询用户名是否已经存在
    const res_0 = await service.user.find_user({ id: _id });
    if (res_0 === 0) {
      ctx.body = {
        message: '删除的用户不存在！',
        error: 1,
      };
      ctx.status = 200;
      return;
    }
    const res_1 = await service.user.delete_user({ id: _id });
    if (res_1.result.affectedRows === 0) {
      ctx.body = {
        message: '删除失败！',
        error: 1,
      };
      ctx.status = 200;
      return;
    }

    ctx.body = {
      message: '删除成功！',
      error: 0,
    };
    ctx.status = 200;
  }
  // 获取用户列表
  async getusers() {
    const { ctx, service } = this;
    const pageSize = 10;
    const currentPage = ctx.query.currentPage ? ctx.query.currentPage : 1;
    const skipnum = (currentPage - 1) * pageSize; // 跳过条数
    const params = {
      _limit: 10,
      _offset: skipnum,
    };
    const res = await service.user.findUsers(params);
    const user_list = [];
    for (let i = 0; i < res.user_list.length; i++) {
      res.user_list[i].roles = JSON.parse(res.user_list[i].roles);
      user_list.push(res.user_list[i]);
    }
    ctx.body = {
      user_list,
      _count: res._count,
      error: 0,
    };
    ctx.status = 200;
  }
  async updata() {
    const { ctx, service } = this;
    const { id, roles } = ctx.request.body;
    const createRule = {
      id: { type: 'number', required: true, allowEmpty: false },
      roles: { type: 'array', required: true, max: 40, allowEmpty: false },
    };
    try {
      ctx.validate(createRule);
    } catch (err) {
      ctx.logger.warn(err.errors);
      const ErrorArr = [];
      for (let i = 0; i < err.errors.length; i++) {
        ErrorArr.push(err.errors[i].field + ':' + err.errors[i].message);
      }
      ctx.body = {
        message: '参数提交错误，' + ErrorArr,
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res01 = await service.user.find_user({ id });
    if (res01 === 0) {
      ctx.body = {
        message: '数据不存在！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res02 = await service.user.updata({ id, roles });
    if (res02.affectedRows === 1) {
      ctx.body = {
        message: '修改成功！',
        error: 0,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        message: '修改失败！',
        error: 1,
      };
      ctx.status = 200;
    }
  }
}

module.exports = UserController;
