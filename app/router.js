'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/banks.json', controller.home.banks);
  router.get('/crawler', controller.home.crawler);
};
