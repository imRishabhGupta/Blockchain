'use strict';
module.exports = function(app) {
  var blockchain = require('../app/app.controller');

  // blockchain Routes
  app.route('/transactions')
    .get(blockchain.listAllTransactions);

};
