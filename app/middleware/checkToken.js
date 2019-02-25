'use strict';
const jwt = require('jsonwebtoken');
const errorNumber = require('../errorNumber.js');

module.exports = () => {
  /**
   * @method    checkToken 验证token
   * @param     {Object}  ctx
   * @param     {functoin}  next 下一个函数
   */
  return async function checkToken(ctx, next) {
    const authorization = ctx.get('Authorization');
    if (authorization === '') {
      ctx.body = {
        data: errorNumber.tokenInvalid[0],
      };
      ctx.status = 401;
      console.log('在http header 无"Authorization"');
    } else {
      try {
        const token = authorization.split(',')[1];
        const decod = jwt.verify(token, 'xiesp');
        ctx.logger.info(decod);
        await next();
      } catch (err) {
        ctx.body = {
          data: errorNumber.tokenInvalid[1],
        };
        ctx.status = 401;
      }
    }
  };
};
