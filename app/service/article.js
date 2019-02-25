'use strict';

const Service = require('egg').Service;
const moment = require('moment');
moment.locale('zh-cn');

class ArticleService extends Service {
  // 创建文章
  async create(value) {
    const { app, service } = this;
    const {
      article_title,
      article_content,
      article_text_content,
      author_id,
    } = value;
    const _id = parseInt(author_id);
    const user = await service.user.find_user({ id: _id });
    if (user === 0) {
      return user;
    }
    console.log(user);
    const result = await app.mysql.insert('articlelist', {
      article_title,
      article_content,
      article_text_content,
      author_id,
      author_name: user.username,
      create_time: new Date().getTime(),
      create_data: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    return result;
  }
  // 单篇
  async findsing(val) {
    const { app } = this;
    const _id = parseInt(val.id);
    // console.log(_id)
    const result = await app.mysql.get('articlelist', { id: _id });
    // console.log(result)
    if (result == null) {
      return 0;
    }
    return result;
  }
  // 读
  async reading(val) {
    const { app } = this;
    const _id = parseInt(val);
    // 点击次数+1
    const result = await app.mysql.get('articlelist', { id: _id });
    if (result == null) {
      return 0;
    }
    // console.log(result)
    const row = {
      count_read: result.count_read + 1,
    };
    const options = {
      where: {
        id: _id,
      },
    };
    await app.mysql.update('articlelist', row, options); // 更新 posts 表中的记录
    return result;
  }
  // 全部
  async findAllArticles(value) {
    const { app } = this;
    const params = {
      // 搜索 post 表
      orders: [[ 'id', 'desc' ]], // 排序方式
      limit: value._limit, // 返回数据量
      offset: value._offset, // 数据偏移量
    };
    const articlelist = await app.mysql.select('articlelist', params);
    const _count = await app.mysql.count('articlelist');
    const _articlelist = JSON.stringify(articlelist); // 把results对象转为字符串，去掉RowDataPacket
    const _article_list = JSON.parse(_articlelist);
    const results = {
      article_list: _article_list,
      count: _count,
    };
    if (_article_list.length === 0) {
      return {
        article_list: [],
        count: 0,
      };
    }
    return results;
  }
  // 删除
  async delete_article(value) {
    const { ctx, app } = this;
    const id = parseInt(value.id);
    const result = await app.mysql.delete('articlelist', { id });
    return { result };
  }
  // 更新
  async updata_article(val) {
    const { ctx, app, service } = this;
    const user = await service.user.find_user({ id: val.author_id });
    if (user === 0) {
      return user;
    }
    // console.log(user);
    const row = {
      article_title: val.article_title,
      article_content: val.article_content,
      article_text_content: val.article_text_content,
      author_name: user.username,
      author_id: user.id,
      updata_time: new Date().getTime(),
      updata_data: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const options = {
      where: {
        id: val.id,
      },
    };
    const result = await app.mysql.update('articlelist', row, options); // 更新 posts 表中的记录
    return result;
  }
}

module.exports = ArticleService;
