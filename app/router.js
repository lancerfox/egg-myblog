'use strict';
const ueditor = require('egg-ueditor');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const checkToken = app.middlewares.checkToken();
  // router.get('cxrf', '/api/v1/cxrf', controller.home.index);

  router.get('home', '/admin', controller.home.admin);
  // 管理端
  router.post('login', '/api/v1/user/login', controller.user.login); // 登录

  // 获取用户列表
  // router.get('userlist', '/api/v1/users/userlist',checkToken, controller.user.getusers);
  router.get(
    'userlist',
    '/api/v1/user/userlist',
    // checkToken,
    app.role.can('user/userlist'),
    controller.user.getusers
  );
  // 创建用户
  router.post(
    'createUser',
    '/api/v1/user/create',
    app.role.can('user/create'),
    controller.user.createUsers
  );
  // 修改用户
  router.post(
    'updataUser',
    '/api/v1/users/updata',
    app.role.can('users/updata'),
    controller.user.updata
  );
  // 删除用户
  router.post(
    'deleteUser',
    '/api/v1/user/delete',
    app.role.can('user/delete'),
    controller.user.delete
  );
  // 添加文章
  router.post(
    'createArticle',
    '/api/v1/article/create',
    controller.article.create
  );
  // 获取文章
  router.get('article', '/api/v1/article', controller.article.show);
  // 获取文章列表
  router.get(
    'articleList',
    '/api/v1/article/articles',
    app.role.can('article/articles'),
    controller.article.findArticles
  );
  // 删除文章
  router.post(
    'deleteArticle',
    '/api/v1/article/delete',
    app.role.can('article/delete'),
    controller.article.delete
  );
  // 修改文章
  router.post(
    'updataArticle',
    '/api/v1/article/updata',
    app.role.can('article/updata'),
    controller.article.updata
  );
  // 上传图片
  router.post('upload', '/api/v1/upload', controller.upload.uploadImg);
  // ueditor上传图片
  app.all('/api/v1/ue', ueditor());
  // router.get('upload', '/api/v1/ueditor', controller.upueditor.getuploadImg);
  // router.post('publishArticle', '/api/v1/article/publish', controller.article.publish);
  // router.post('returningArticle', '/api/v1/article/returning', controller.article.returning);
  // 创建资源
  router.post(
    'create-resource',
    '/api/v1/resource/create',
    app.role.can('resource/create'),
    controller.resource.create
  );
  // 删除资源
  router.post(
    'delete-resource',
    '/api/v1/resource/delete',
    app.role.can('resource/delete'),
    controller.resource.delete
  );
  // 修改资源
  router.post(
    'updata-resource',
    '/api/v1/resource/updata',
    app.role.can('resource/updata'),
    controller.resource.updata
  );

  // 获取单个资源
  router.get(
    'show-resource',
    '/api/v1/resource/show',
    controller.resource.show
  );
  // 获取资源列表
  router.get(
    'show-resourceList',
    '/api/v1/resource/showlist',
    app.role.can('resource/showlist'),
    controller.resource.showlist
  );
  // 创建角色
  router.post(
    'create-role',
    '/api/v1/role/create',
    app.role.can('role/create'),
    controller.role.create
  );
  // 删除角色
  router.post(
    'delete-role',
    '/api/v1/role/delete',
    app.role.can('role/delete'),
    controller.role.delete
  );
  // 修改角色
  router.post(
    'updata-role',
    '/api/v1/role/updata',
    app.role.can('role/updata'),
    controller.role.updata
  );
  // 修改角色拥有的资源
  router.post(
    'updata-role-power',
    '/api/v1/role/updatapower',
    app.role.can('role/updatapower'),
    controller.role.updatapower
  );
  // 获取单个角色
  router.get('show-role', '/api/v1/role/show', controller.role.show);
  // 获取角色列表
  router.get(
    'show-roleList',
    '/api/v1/role/showlist',
    app.role.can('role/showlist'),
    controller.role.showlist
  );
  // 获取角色选项卡列表
  router.get(
    'show-role-selectList',
    '/api/v1/role/selectList',
    controller.role.selectList
  );
};
