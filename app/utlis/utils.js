'use strict';
const _util = {
  // 判断是否为空
  isEmpty(value) {
    return (
      value === 'NaN' ||
      value === '' ||
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
    );
  },
  // 过滤emoji
  filteremoji(val) {
    const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
    return val.replace(regStr, '');
  },
  uniq(array) {
    const temp = []; // 一个新的临时数组
    for (let i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },
};

module.exports = _util;
