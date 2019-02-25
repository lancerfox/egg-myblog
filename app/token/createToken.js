'use strict';
const jwt = require('jsonwebtoken');
/**
 * @method    生成token
 * @param     {String}  user_id 用户Id
 * @return    {String}   token
 */
module.exports = function(user_id) {
  const token = jwt.sign(
    {
      user_id,
    },
    'xiesp',
    { expiresIn: '6h' }
  );
  return token;
};
