'use strict';

const Controller = require('egg').Controller;
// const _utils = require('../utlis/utils.js');
class ArticleController extends Controller {
  // 创建文章
  async create() {
    const { ctx, service } = this;
    const {
      article_title,
      article_content,
      article_text_content,
      author_id,
    } = ctx.request.body;
    const createRule = {
      article_title: { type: 'string', required: true, max: 40 },
      article_content: { type: 'string', required: true },
      article_text_content: { type: 'string', required: true },
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
        message: ErrorArr + '格式错误！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const params = {
      article_title: ctx.helper.escape(article_title), // 把用户输入做XSS过滤
      article_content, // 把用户富文本做XSS过滤
      article_text_content,
      author_id,
    };
    const res = await service.article.create(params);
    if (res === 0) {
      ctx.body = {
        message: '保存失败，未找到用户！',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    if (res.affectedRows === 1) {
      ctx.body = {
        message: '保存成功！',
        error: 0,
      };
      ctx.status = 200;
    } else {
      ctx.body = {
        message: '保存失败！',
        error: 1,
      };
      ctx.status = 200;
    }
  }
  // 显示单篇文章
  async show() {
    const { ctx, service } = this;
    const _id = parseInt(ctx.query.id);
    // 验证参数类型
    const createRule = {
      _id: {
        type: 'number',
        required: true,
        allowEmpty: false,
      },
    };
    try {
      ctx.validate(createRule, { _id });
    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = {
        message: err.errors,
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    const res = await service.article.reading(_id);
    if (res === 0) {
      ctx.body = {
        data: '数据不存在',
        error: 1,
      };
      ctx.status = 200;
      return false;
    }
    ctx.body = {
      article: res,
      error: 0,
    };
    ctx.status = 200;
  }
  // 文章列表
  async findArticles() {
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
    const res = await service.article.findAllArticles(params);
    if (res._count === 0) {
      ctx.body = {
        messger: '没有查询到数据！',
        error: 1,
      };
      ctx.status = 200;
    }
    ctx.body = {
      article_list: res.article_list,
      count: res.count,
      error: 1,
    };
    ctx.status = 200;
  }
  // 删除
  async delete() {
    const { ctx, service } = this;
    const _id = ctx.request.body.id;
    // console.log(_id)
    // 查询用户名是否已经存在
    const res_0 = await service.article.findsing({ id: _id });
    // console.log(res_0)
    if (res_0 === 0) {
      ctx.body = {
        message: '删除的文章不存在！',
        error: 1,
      };
      ctx.status = 200;
      return;
    }
    const res_1 = await service.article.delete_article({ id: _id });
    // console.log(res_1)
    if (res_1.result.affectedRows === 0) {
      ctx.body = {
        message: '删除失败！' + res_1,
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
  // 更新
  async updata() {
    const { ctx, service } = this;
    const {
      article_title,
      article_content,
      article_text_content,
      author_id,
      id,
    } = ctx.request.body;
    // 查询用户名是否已经存在
    const res_0 = await service.article.findsing({ id });
    if (res_0 === 0) {
      ctx.body = {
        message: '修改的文章不存在！',
        error: 1,
      };
      ctx.status = 200;
      return;
    }
    const params = {
      article_title,
      article_content,
      article_text_content,
      author_id,
      id,
    };

    const res_1 = await service.article.updata_article(params);
    // console.log(res_1)
    if (res_1 === 0) {
      ctx.body = {
        message: '查找不到相应的用户！',
        error: 1,
      };
      ctx.status = 200;
      return;
    }
    if (res_1.affectedRows === 0) {
      ctx.body = {
        message: '修改失败！' + res_1,
        error: 1,
      };
      ctx.status = 200;
      return;
    }

    ctx.body = {
      message: '修改成功！',
      error: 0,
    };
    ctx.status = 200;
  }
}

module.exports = ArticleController;
