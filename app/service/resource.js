'use strict';
const Service = require('egg').Service;

class ResourceService extends Service {
  // 创建
  async create(value) {
    const { app } = this;
    const { title, type, parentId, path } = value;
    const result = await app.mysql.insert('resource', {
      title,
      type,
      parentId,
      path,
    });
    return result;
  }
  // 删除
  async delete(value) {
    const { app } = this;
    const { id } = value;
    const result = await app.mysql.delete('resource', {
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
    const result = await app.mysql.update('resource', row, options);
    return result;
  }
  // 查询单条数据
  async find(value) {
    const { app } = this;
    const { id, path } = value;
    const sql =
      'SELECT * from resource WHERE path=' +
      '"' +
      path +
      '"' +
      'or id=' +
      '"' +
      id +
      '"' +
      ';';
    const result = await app.mysql.query(sql);
    return result;
  }
  async findAll() {
    const { app } = this;
    // const params = {
    //   // 搜索 post 表
    //   orders: [[ 'id', 'desc' ]], // 排序方式
    //   limit: value._limit, // 返回数据量
    //   offset: value._offset, // 数据偏移量
    // };
    const resourcelist = await app.mysql.select('resource');
    const _count = await app.mysql.count('resource');
    const resourcelist_01 = JSON.stringify(resourcelist); // 把results对象转为字符串，去掉RowDataPacket
    const resourcelist_02 = JSON.parse(resourcelist_01);
    const results = {
      resourcelist: resourcelist_02,
      count: _count,
    };
    if (resourcelist.length === 0) {
      return {
        resourcelist: [],
        count: 0,
      };
    }
    return results;
  }
}
module.exports = ResourceService;
