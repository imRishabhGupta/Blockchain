const SHA256 = require("crypto-js/sha256");

var Block = require('./model/block')

var chain = [];
var currentTransactions= [];

var init = function() {
	
	currentTransactions = null;
	newBlock(100, 1);
	currentTransactions = [];

}

exports.newTransaction = function(req, res) {


	if(chain.length == 0)
		init();

	var body = req.body;

	if(!body.sender || !body.recipient || !body.amount){
		res.status(400).json({success: false, message: "Please enter information."})
	}

	addTransaction(body.sender, body.recipient, body.amount);

    res.status(200).json({success: true, message: "Correct information."});
}

var addTransaction = function(sender, recipient, amount) {
	currentTransactions.push({
		'sender': sender,
		'recipient': recipient,
		'amount': amount
	});
}

exports.mine = function (req, res) {

	var lastProof = chain[lastBlock()].proof;
	var proof = proofOfWork(lastProof);
	addTransaction("0", "me", 1);
	previousHash = calculateHash(chain[lastBlock()]);
	block = newBlock(proof, previousHash);
	res.status(200).json({
		message: "New block forged",
		index: block.index,
		transactions: block.data,
		proof: block.proof,
		previousHash: block.previousHash
	});
}

var newBlock = function(proof, previousHash) {

	var d = new Date();
	var block = new Block(chain.length, d.getTime(), currentTransactions, proof, previousHash);
	currentTransactions = [];
	chain.push(block);
	return block;
 
};

exports.test = function(req, res) {
	
	res.json(chain);
};	

validChain = function() {

	var prev = chain[0];
	var i = 1;

	while(i < chain.length) {

		var prevHash = calculateHash(prev);
		var currBlock = chain[i];

		if(prevHash!=currBlock.previousHash)
			return false;
		if(!validProof(prev.proof, currBlock.proof))
			return false;

		prev = currBlock;
		i++;
	}
	return true;
}

var lastBlock = function() {
	return (chain.length - 1);
}

var calculateHash = function(block) {
    return SHA256( JSON.stringify(block) ).toString();
}

var proofOfWork = function(lastProof) {
	proof = 0;
	while(validProof(lastProof, proof) == false) {
		console.log(proof);
		proof++;
	}
	return proof;

}

var validProof = function(lastProof, proof) {

	var guess = lastProof.toString() + proof.toString();
	guessHash = SHA256(guess).toString();
	return guessHash[guessHash.length-1] == '0';

}
