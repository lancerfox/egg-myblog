'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const FilePath = path.join(__dirname, '../public/');
const toArray = require('stream-to-array'); // Returns all the data objects in an array.
const moment = require('moment');
moment.locale('zh-cn');

const writeFile = (readerStream, buf) => {
  // return new Promise((resolve, reject) => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const timestamp2 = moment().format('YYYYMMDD');
  const filenameArr = readerStream.filename.split('.');
  let type = '';
  for (let index = 0; index < filenameArr.length; index++) {
    type = filenameArr[filenameArr.length - 1];
  }
  const saveImgName = timestamp + '.' + type;
  const newFilePath = FilePath + '/' + timestamp2 + '/' + saveImgName;
  const n = FilePath + timestamp2;
  // 创建文件夹
  if (!fs.existsSync(n)) {
    // 检查目录是否存在
    fs.mkdirSync(n);
  }
  // 本地图片
  const imgUrl =
    'http://localhost:7001/public/' + '/' + timestamp2 + '/' + saveImgName;
  // let localimg = 'http://www.xiesp.top/api/public/' + saveImgName;
  fs.writeFileSync(newFilePath, buf, err => {
    if (err) {
      return {
        message: '文件写入失败！',
        error: 1,
      };
    }
  });
  return {
    url: imgUrl,
    code: 200,
  };
  //    var writerStream =   fs.createWriteStream(newFilePath);
  // writerStream.write(buf)
  // writerStream.end();

  // writerStream.on('error', function(err){
  //     console.log(err.stack);

  // });
  // writerStream.on('finish', function() {
  //     console.log("写入完成。")
  //     // resolve(localimg);
  // });
  // reject("文件读取失败!")
  // })
};

// const readStreamFile = (filename) => {
//     return new Promise((executor, reject) => {
//       let chunks = [];
//       const reader = fs.createReadStream(filename)
//       reader.on('data', (chunk) => {
//         chunks.push(chunk);
//       })
//       reader.on('end', () => {
//         reader.close();
//         executor(Buffer.concat(chunks).toString('base64'));
//       })
//       reader.on('error', (err) => {
//         reject(err);
//       })
//     })
//   }

class uploadController extends Controller {
  async uploadImg() {
    const { ctx } = this;
    const readerStream = await ctx.getFileStream();
    // 把流转换为buff
    const parts = await toArray(readerStream);
    const buf = Buffer.concat(parts);
    try {
      const res = await writeFile(readerStream, buf);
      ctx.status = 200;
      ctx.body = {
        res,
      };
    } catch (err) {
      await sendToWormhole(readerStream);
    }
  }
}

module.exports = uploadController;
