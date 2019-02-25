'use strict';
const Controller = require('egg').Controller;
class RoleController extends Controller {
  // 创建资源
  async create() {
    const { ctx, service } = this;
    const { title } = ctx.request.body;
    const createRule = {
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
    const params = {
      title: ctx.helper.escape(title), // 把用户输入做XSS过滤
    };
    const res = await service.role.create(params);
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
    const res = await service.role.delete({ id });
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
    const res01 = await service.role.find({ id });
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
    const res02 = await service.role.updata({ id, title });
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
  // 更新
  async updatapower() {
    const { ctx, service } = this;
    const { id, powers } = ctx.request.body;
    const createRule = {
      id: { type: 'number', required: true, allowEmpty: false },
      powers: { type: 'array', required: true, allowEmpty: false },
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
    const res01 = await service.role.find({ id });
    if (res01 === null) {
      ctx.body = {
        message: '数据不存在！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res02 = await service.role.updatapower({ id, powers });
    if (res02.affectedRows === 1) {
      ctx.body = {
        message: '添加成功！',
        error: 0,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        message: '添加失败！',
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
    const res01 = await service.role.find({ id });
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
    const pageSize = 10;
    const currentPage = ctx.query.currentPage
      ? parseInt(ctx.query.currentPage)
      : 1;
    // 验证参数类型
    const createRule = {
      currentPage: {
        type: 'number',
        required: true,
        allowEmpty: false,
      },
    };
    try {
      ctx.validate(createRule, { currentPage });
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        message: err.errors,
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const skipnum = (currentPage - 1) * pageSize; // 跳过条数
    const params = {
      _limit: 10,
      _offset: skipnum,
    };
    const res = await service.role.findAll(params);
    let role_list = [];
    for (let i = 0; i < res.rolelist.length; i++) {
      res.rolelist[i].powers = JSON.parse(res.rolelist[i].powers);
      role_list.push(res.rolelist[i]);
    }
    ctx.body = {
      role_list,
      count: res.count,
      error: 0,
    };
    ctx.status = 200;
    role_list = [];
  }
  //  选项卡列表列表
  async selectList() {
    const { ctx, service } = this;
    const res = await service.role.selectList();
    let select_list = [];
    for (let i = 0; i < res.rolelist.length; i++) {
      const item = {};
      item.label = res.rolelist[i].title;
      item.value = res.rolelist[i].id;
      select_list.push(item);
    }
    ctx.body = {
      select_list,
      count: res.count,
      error: 0,
    };
    ctx.status = 200;
    select_list = [];
  }
}
module.exports = RoleController;
