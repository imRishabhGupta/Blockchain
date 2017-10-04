'use strict';
module.exports = function(app) {
  var blockchain = require('./blockchain');

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
