'use strict';

module.exports = appInfo => {
    const config = {};

    // should change to your own
    config.keys = appInfo.name + '_1524210999853_2952';

    // add your config here
    config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };

    config.env = "local";

    config.mongoose = {
        url: 'mongodb://10.0.30.61/kabao_dev',
        options: {}
    };
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '10.0.30.61',   // Redis host
            password: 'fuckyou',
            db: 2,
        },
    }
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
