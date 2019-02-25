'use strict';

module.exports = appInfo => {
  const config = (exports = {
    // onerror: {
    //     all(err, ctx) {
    //         // 在此处定义针对所有响应类型的错误处理方法
    //         // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    //         ctx.body = '请求发生错误';
    //         ctx.status = 400;
    //     }
    // }
  });
  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1537432553570_7978';

  // add your config here
  config.middleware = [];
  // mysql
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'littlenote',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  config.security = {
    csrf: {
      // ignoreJSON: true, //允许json格式的请求
      enable: false, // 不启动
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
    },
  };
  return config;
};
