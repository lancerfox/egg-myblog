'use strict';
const Service = require('egg').Service;
const moment = require('moment');
const _utlis = require('../utlis/utils.js');
moment.locale('zh-cn');
class roleService extends Service {
  // 创建
  async create(value) {
    const { app } = this;
    const { title } = value;
    const result = await app.mysql.insert('role', {
      title,
      powers: '[]',
      createdate: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    return result;
  }
  // 删除
  async delete(value) {
    const { app } = this;
    const { id } = value;
    const result = await app.mysql.delete('role', {
      id,
    });
    return result;
  }
  // 修改
  async updata(value) {
    const { app } = this;
    const { id, title } = value;
    const row = {
      title,
    };

    const options = {
      where: {
        id,
      },
    };
    const result = await app.mysql.update('role', row, options);
    return result;
  }
  // 修改资源
  async updatapower(value) {
    const { app } = this;
    const { id, powers } = value;
    const row = {
      powers: '[' + powers + ']',
    };
    const options = {
      where: {
        id,
      },
    };
    const result = await app.mysql.update('role', row, options);
    return result;
  }
  // 查询单条数据
  async find(value) {
    const { app } = this;
    const { id } = value;
    const result = await app.mysql.get('role', {
      id,
    });
    return result;
  }
  async findAll(value) {
    const { app } = this;
    const params = {
      // 搜索 post 表
      orders: [[ 'id', 'desc' ]], // 排序方式
      limit: value._limit, // 返回数据量
      offset: value._offset, // 数据偏移量
    };
    const rolelist = await app.mysql.select('role', params);
    const _count = await app.mysql.count('role');
    const rolelist_01 = JSON.stringify(rolelist); // 把results对象转为字符串，去掉RowDataPacket
    const rolelist_02 = JSON.parse(rolelist_01);
    const results = {
      rolelist: rolelist_02,
      count: _count,
    };
    if (rolelist.length === 0) {
      return {
        rolelist: [],
        count: 0,
      };
    }
    return results;
  }
  // 选项卡列表
  async selectList() {
    const { app } = this;
    const params = {
      orders: [[ 'id', 'desc' ]], // 排序方式
    };
    const rolelist = await app.mysql.select('role', params);
    const _count = await app.mysql.count('role');
    const rolelist_01 = JSON.stringify(rolelist); // 把results对象转为字符串，去掉RowDataPacket
    const rolelist_02 = JSON.parse(rolelist_01);
    const results = {
      rolelist: rolelist_02,
      count: _count,
    };
    if (rolelist.length === 0) {
      return {
        rolelist: [],
        count: 0,
      };
    }
    return results;
  }
  // 角色拥有的资源
  async roleHaveingResource(roles) {
    const { app } = this;
    // 获取用户的角色资源id
    const sql =
      'SELECT  powers  FROM  role   WHERE id IN (' +
      JSON.parse(roles).join(',') +
      ');';
    const result = await app.mysql.query(sql);
    const a1 = JSON.stringify(result);
    const a2 = JSON.parse(a1);
    let allId = [];
    for (let i = 0; i < a2.length; i++) {
      allId = allId.concat(JSON.parse(a2[i].powers));
    }
    return _utlis.uniq(allId);
  }
}
module.exports = roleService;
