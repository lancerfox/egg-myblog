'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcrypt');
const moment = require('moment');
moment.locale('zh-cn');
class UserService extends Service {
  async find_user(value) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const { ctx, app } = this;
    const _id = parseInt(value.id);
    const sql =
      'SELECT * from users WHERE username=' +
      '"' +
      ctx.helper.escape(value.username) +
      '"' +
      'or id=' +
      '"' +
      ctx.helper.escape(_id) +
      '"' +
      ';';
    const user = await app.mysql.query(sql);
    const _user = JSON.stringify(user); // 把results对象转为字符串，去掉RowDataPacket
    const results = JSON.parse(_user);
    if (results.length === 0) {
      return 0;
    }
    return results[0];
  }
  // 查找全部用户
  async findUsers(value) {
    const { ctx, app } = this;
    const params = {
      // 搜索 post 表
      orders: [[ 'id', 'desc' ]], // 排序方式
      limit: value._limit, // 返回数据量
      offset: value._offset, // 数据偏移量
    };
    const user = await app.mysql.select('users', params);
    const count = await app.mysql.count('users');
    const _user = JSON.stringify(user); // 把results对象转为字符串，去掉RowDataPacket
    const _user_list = JSON.parse(_user);
    const results = {
      user_list: _user_list,
      _count: count,
    };
    if (_user_list.length === 0) {
      return {
        user_list: [],
        _count: 0,
      };
    }
    return results;
  }
  // 创建用户
  async create(value) {
    const { ctx, app } = this;
    const { username, password } = value;
    // 加密
    const saltRounds = 10; // 加密次数
    // 随机生成salt
    const salt = bcrypt.genSaltSync(saltRounds);
    // 获取hash值
    const hashPassword = bcrypt.hashSync(password, salt);
    const params = {
      username: ctx.helper.escape(username),
      password: hashPassword,
      create_time: new Date().getTime(),
      create_data: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    const result = await app.mysql.insert('users', params);
    return result;
  }
  // 删除用户
  async delete_user(value) {
    const { app } = this;
    const { id } = value;
    const result = await app.mysql.delete('users', { id: parseInt(id) });
    return { result };
  }
  // 修改
  async updata(value) {
    const { app } = this;
    const { id, roles } = value;
    const row = {
      roles: '[' + roles + ']',
    };

    const options = {
      where: {
        id,
      },
    };
    const result = await app.mysql.update('users', row, options);
    return result;
  }
}

module.exports = UserService;
