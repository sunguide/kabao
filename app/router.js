'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.index.index);
  router.get('/banks.json', controller.home.banks);
  router.get('/crawler', controller.home.crawler);
  router.get('/test', controller.home.test);
  router.get('/api', controller.home.test);
  router.get('/api/test', controller.api.test);
  router.get('/api/banks', controller.api.banks);
  router.get('/api/bill/update', controller.api.billUpdate);
  router.get('/crawler/fetchBanks', controller.crawler.fetchBanks)
  router.get('/test/fetchPage', controller.test.fetchPage);

  router.get('/user/profile', controller.user.profile);

  router.get('/api/user/card/add', controller.api.user.addCard);
  router.resources('user/cards', '/api/user/cards', app.controller.api.user.card);


};
