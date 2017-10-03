'use strict';
module.exports = function(app) {
  var controller = require('./app.controller');
  var blockchain = require('./blockchain');

  app.route('/transactions')
    .get(controller.listAllTransactions);

  app.route('/chain')
  	.get(blockchain.getChain);

  app.route('/transactions/new')
  	.post(blockchain.newTransaction);

  app.route('/mine')
  	.get(blockchain.mine);

  app.route('/register')
  	.post(blockchain.registerNodes);

  app.route('/resolve')
  	.get(blockchain.consensus);

};
