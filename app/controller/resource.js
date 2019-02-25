'use strict';

const Controller = require('egg').Controller;
class ResourceController extends Controller {
  // 创建资源
  async create() {
    const { ctx, service } = this;
    const { title, parentId, type, path } = ctx.request.body;
    const createRule = {
      title: { type: 'string', required: true, max: 40, allowEmpty: false },
      path: { type: 'string', required: true, allowEmpty: false },
      parentId: { type: 'number', required: true, allowEmpty: false },
      type: {
        type: 'enum',
        required: true,
        allowEmpty: false,
        values: [ 1, 2, 3 ],
      },
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
    const params = {
      title: ctx.helper.escape(title), // 把用户输入做XSS过滤
      parentId: ctx.helper.escape(parentId),
      type,
      path,
    };
    const res = await service.resource.create(params);
    if (res.affectedRows === 1) {
      ctx.body = {
        message: '创建成功！',
        error: 0,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        message: '创建失败！',
        error: 1,
      };
      ctx.status = 200;
    }
  }
  // 删除
  async delete() {
    const { ctx, service } = this;
    const { id } = ctx.request.body;
    const createRule = {
      id: { type: 'number', required: true, allowEmpty: false },
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
    const res = await service.resource.delete({ id });
    console.log(res);
    if (res.affectedRows === 1) {
      ctx.body = {
        message: '删除成功！',
        error: 0,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        message: '删除失败！',
        error: 1,
      };
      ctx.status = 200;
    }
  }
  // 更新
  async updata() {
    const { ctx, service } = this;
    const { id, title } = ctx.request.body;
    const createRule = {
      id: { type: 'number', required: true, allowEmpty: false },
      title: { type: 'string', required: true, max: 40, allowEmpty: false },
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
    const res01 = await service.resource.find({ id });
    if (res01 === null) {
      ctx.body = {
        message: '数据不存在！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res01_1 = JSON.stringify(res01); // 把results对象转为字符串，去掉RowDataPacket
    const val = JSON.parse(res01_1);
    if (val.title === title) {
      ctx.body = {
        message: '名称已经存在！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res02 = await service.resource.updata({ id, title });
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
  // 查询单个资源
  async show() {
    const { ctx, service } = this;
    const _id = ctx.query.id;
    if (_id === '') {
      ctx.body = {
        message: 'id参数提交错误',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const id = parseInt(_id);
    const createRule = {
      id: { type: 'number', required: true, allowEmpty: false },
      // title: { type: 'string', required: true, max: 40, allowEmpty: false },
    };
    try {
      ctx.validate(createRule, { id });
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
    const res01 = await service.resource.find({ id });
    if (res01 === null) {
      ctx.body = {
        message: '数据不存在！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res01_1 = JSON.stringify(res01); // 把results对象转为字符串，去掉RowDataPacket
    const val = JSON.parse(res01_1);
    ctx.body = {
      resource: val,
      error: 0,
    };
    ctx.status = 200;
  }
  // 数据列表
  async showlist() {
    const { ctx, service } = this;
    const res = await service.resource.findAll();
    if (res._count === 0) {
      ctx.body = {
        messger: '没有查询到数据！',
        error: 1,
      };
      ctx.status = 200;
    }
    ctx.body = {
      resource_list: res.resourcelist,
      count: res.count,
      error: 0,
    };
    ctx.status = 200;
  }
}

module.exports = ResourceController;
