'use strict';

// had enabled by egg
// exports.static = true;
exports.nunjucks = {
  enable: false,
  package: 'egg-view-nunjucks',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
exports.redis = {
  enable: false,
  package: 'egg-redis',
};
