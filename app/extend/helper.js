module.exports = helper = {
  config(key){
     let config = this.app.config;
     if(key.indexOf('.') > 0){
        const keys = key.split('.');
        while (key = keys.shift()){
            config = config[key];
        }
     }else{
       config = config[key];
     }
     return config;
  },
  getFullStockCode(stock_code) {
    if (stock_code < "600000") {
      return "SZ" + stock_code;
    } else {
      return "SH" + stock_code;
    }
  },
  getStockAnchor(stock_code, stock_name){
    return "$" + stock_name + "(" + helper.getFullStockCode(stock_code) + ")$";
  },
  md5(str){
    let crypto = require("crypto");
    let md5 = crypto.createHash("md5");
    md5.update(str);
    str = md5.digest('hex');
    return str.toUpperCase();
  },
  //unicode 4E00-9FA5
  //生成密码
  password(str){
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return new Promise((resolve,reject) => {
      bcrypt.hash(str, saltRounds, function(err, hash) {
        if(err){
          reject(err);
        }
        resolve(hash);
      });
    })
  },
  //验证密码
  async checkPassword(password, passwordHash){
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, passwordHash);
  },
  /**
   * @aes192加密模块
   * @param str string 要加密的字符串
   * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
   * @retrun string 加密后的字符串
   * */
  getEncAes256(str, secret) {
    let crypto = require("crypto");
    let cipher = crypto.createCipher("aes256", secret); //设置加密类型 和 要使用的加密密钥
    let enc = cipher.update(str, "utf8", "hex");    //编码方式从utf-8转为hex;
    enc += cipher.final("hex"); //编码方式从转为hex;
    return enc; //返回加密后的字符串
  },
  /**
   * @aes256解密模块
   * @param str string 要解密的字符串
   * @param secret string 要使用的解密密钥(要和密码的加密密钥对应,不然就解不了密啦)
   * @retrun string 解密后的字符串
   * */
  getDecAes256(str, secret) {
    let crypto = require("crypto");
    let decipher = crypto.createDecipher("aes256", secret);
    let dec = decipher.update(str, "hex", "utf8");//编码方式从hex转为utf-8;
    dec += decipher.final("utf8");//编码方式从utf-8;
    return dec;
  },
  randomChinese(length){
    //unicode
    let range, rand, min, max;
    let char = [];
    let chars = [];
    for (let i = 0; i < length; i++) {
      //1
      max = 9;
      min = 4;
      range = max - min;
      rand = Math.random();
      char[0] = min + Math.round(rand * range);
      //2
      max = 15;
      min = char[0] === 4 ? 14 : 0;
      range = max - min;
      rand = Math.random();
      char[1] = min + Math.round(rand * range);
      //3
      max = char[0] === 9 && char[1] === 15 ? 10 : 15;
      min = 0;
      range = max - min;
      rand = Math.random();
      char[2] = min + Math.round(rand * range);
      //4
      max = char[0] === 9 && char[1] === 15 && char[2] === 10 ? 5 : 15;
      min = 0;
      range = max - min;
      rand = Math.random();
      char[3] = min + Math.round(rand * range);

      for (let k = 0; k < 4; k++) {
        char[k] = char[k].toString(16);
      }
      chars.push("\\u" + char.join(''));
    }
    return eval("'" + chars.join('') + "'");

  },
  datetime(format, timestamp){
    const moment = require("moment");
    if (timestamp) {
      return moment(timestamp).format(format);
    }
    return moment().format(format);
  },
  format(date, format){
    const moment = require("moment");
    return moment(date).format(format);
  },
  * sleep(timeout){
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(true);
      }, timeout);
    });
  },
  getOneTip(index){
    index = index || 0;
    let tips = require("../../data/investment_tips.js").tips;
    if (index < tips.length) {
      return tips[index];
    } else {
      return false;
    }
  },
  JSON: {
    parse(str){
      try {
        str = JSON.parse(str);
      } catch (e) {
        return false;
      }
      return str;
    }
  },

  formatBillDate(date){
    if(typeof date === "string"){
      return date.replace(/[-\/]/g,'');
    }
    if(typeof date === "number"){
      return date;
    }
    return 0
  },
  currencyParse(str){
    let result = {
      "currency":"￥",
      "amount":0
    };
    if(!str || typeof str !== "string"){
      return result;
    }
    let currencyMap = ['￥','$','€','￡','₣','¥','₩'];
    for(let key in currencyMap){
      if(str.indexOf(currencyMap[key]) > -1){
        str = str.replace(currencyMap[key],"").replace(/,/g,"").trim();
        return {
          "currency":currencyMap[key],
          "amount":str
        }
      }
    }
    return result;
  }
};
