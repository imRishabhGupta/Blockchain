'use strict';
module.exports = function(app) {
  var controller = require('./app.controller');
  var blockchain = require('./blockchain');

  // blockchain Routes
  app.route('/transactions')
    .get(controller.listAllTransactions);

  app.route('/test')
  	.get(blockchain.test);

};
