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
  // router.get('/api/test', controller.api.test);
  router.get('/api/banks', controller.api2.banks);
  router.get('/api/bill/update', controller.api2.billUpdate);
  router.get('/crawler/fetchBanks', controller.crawler.fetchBanks)
  // router.get('/test/fetchPage', controller.test.fetchPage);

  router.get('/user/profile', controller.user.profile);
  router.get('/user/cards', controller.user.cards);

  router.get('/api/user/card/add', controller.api.users.addCard);
  router.resources('api/user/cards', '/api/user/cards', app.controller.api.user.cards);
  router.resources('api/topics', '/api/topics', app.controller.api.topics);



};
