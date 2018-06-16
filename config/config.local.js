'use strict';

module.exports = appInfo => {
    const config = {};

    // should change to your own
    config.keys = appInfo.name + '_1524210999853_2952';

    // add your config here

    //常用的域名URL
    config.urls = {
      api: '/api',
      mcc: '/mcc'
    };
    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };

    config.env = "local";

    config.mongoose = {
        // url: 'mongodb://10.0.30.61/kabao_dev',
        url: 'mongodb://127.0.0.1/kabao_dev',
        options: {}
    };
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '10.0.30.61',   // Redis host
            password: 'fuckyou',
            db: 2,
        },
    };
    config.security = {
      csrf: {
        enable:false,
        useSession: false, // if useSession set to true, the secret will keep in session instead of cookie
        ignoreJSON: false, // skip check JSON requests if ignoreJSON set to true
        queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
        bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
      },
      domainWhiteList: ['http://localhost:7007']
    };
    config.mysql = {
      client: {
          // host
          host: 'localhost',
          // port
          port: '3306',
          // username
          user: 'root',
          // password
          password: 'admin',
          // database
          database: 'kabao',
      },
      // default configuration for all databases
      default: {

      },

      // load into app, default is open
      app: true,
      // load into agent, default is close
      agent: false,
    };
    return config;
};

//
// module.exports = {
//   // 配置需要的中间件，数组顺序即为中间件的加载顺序
//   middleware: [ 'gzip' ],
//   // 配置 gzip 中间件的配置
//   gzip: {
//     threshold: 1024, // 小于 1k 的响应体不压缩
//   },
// };
