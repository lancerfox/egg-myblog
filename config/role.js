'use strict';
function isRole(arr1, id) {
  let isExist = false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] === id) {
      return true;
    }
    isExist = false;
  }
  return isExist;
}

module.exports = function(app) {
  // 错误函数
  app.role.failureHandler = function(ctx) {
    const message = '当前用户权限不足';
    console.log(ctx.acceptJSON);
    if (ctx.acceptJSON) {
      ctx.status = 403;
      ctx.body = {
        message,
      };
    }
  };
  app.role.use(async function(ctx, action) {
    console.log(action);
    // 在cookie中获取UUid
    const id = ctx.cookies.get('uuid', {
      signed: false,
    });
    // console.log(id);
    // 获取用户角色
    const user_1 = await ctx.service.user.find_user({ id });
    const user_2 = JSON.stringify(user_1); // 把results对象转为字符串，去掉RowDataPacket
    const user_3 = JSON.parse(user_2);
    // console.log(user_3);
    if (user_3.issuperadmin === 1) {
      return true;
    }
    const allid = await ctx.service.role.roleHaveingResource(user_3.roles);
    const resource_1 = await ctx.service.resource.find({ path: action });
    const resource_2 = JSON.stringify(resource_1); // 把results对象转为字符串，去掉RowDataPacket
    const resource_3 = JSON.parse(resource_2);
    if (resource_3.length === 0) {
      return false;
    }
    return isRole(allid, resource_3[0].id);
  });
};
