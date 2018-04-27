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
    config.env = "prod";

    config.mongoose = {
        url: 'mongodb://10.0.30.61/kabao',
        options: {}
    };
    config.redis = {
        client: {
            port: 6379,          // Redis port
            host: '10.0.30.61',   // Redis host
            password: 'fuckyou',
            db: 3,
        },
    }
    return config;
};
