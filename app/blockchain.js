const SHA256 = require("crypto-js/sha256");

var Block = require('./model/block')

var chain = [];
var currentTransactions= [];

var newTransaction = function(sender, recipient, amount) {

	currentTransactions.push({
		'sender': sender,
		'recipient': recipient,
		'amount': amount
	});

	return lastBlock() + 1;
}

var newBlock = function(proof, previousHash) {

	var d = new Date();
	var block = new Block(chain.length, d.getTime(), currentTransactions, proof, previousHash);
	currentTransactions = [];
	chain.push(block);
	return block;
 
};

exports.test = function(req, res) {
	var d = new Date();
	var block = new Block("this.chain.length", d.getTime(), "this.currentTransactions", 55, "rvdr");
	console.log(calculateHash(block));
	chain.push(block);
	console.log(chain.length);
	res.json(block);
};	

var lastBlock = function() {
	return chain.length - 1;
}

var calculateHash = function(block) {
    return SHA256( JSON.stringify(block) ).toString();
}

var proofOfWork = function(lastProof) {
	proof = 0;
	while(validProof(lastProof, proof) != false) {
		proof++;
	}
	return proof;

}

var validProof = function(lastProof, proof) {

	var guess = lastProof.toString() + proof.toString();
	guessHash = SHA256(guess).toString();
	return guessHash.substring(-4, 0) == "0000";

}
