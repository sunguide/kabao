'use strict';

// had enabled by egg
// exports.static = true;
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.mongoose = {
  enable: false,
  package: 'egg-mongoose',
};
exports.redis = {
  enable: false,
  package: 'egg-redis',
};
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

