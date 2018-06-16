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
      password: 'woshinilao8',
      // database
      database: 'kabao',
    },
    // default configuration for all databases
    default: {},

    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };
  return config;
};
