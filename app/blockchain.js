const SHA256 = require("crypto-js/sha256");
var Set = require("collections/set");
var Block = require('./model/block');
var request = require('request');

var chain = [];
var currentTransactions = [];
var nodes = new Set();

var init = function() {
	
	currentTransactions = null;
	newBlock(100, 1);
	currentTransactions = [];

};

var registerNode = function(req) {
	//nodes.add(req.connection.remoteAddress);
	nodes.add(req.get('host'));
};

exports.registerNodes = function(req, res) {
	
	var body = req.body;
	if(!body.nodes){
		res.status(400).json({success: false, message: "Could not add new nodes."})
	}
	newNodes = body.nodes;
	for(i=0;i<newNodes.length;i++)
		nodes.add(newNodes[i]);

	res.status(200).json({success: true, message: "New nodes addes."});
};

exports.newTransaction = function(req, res) {

	if(chain.length == 0)
		init();

	var body = req.body;

	if(!body.sender || !body.recipient || !body.amount){
		res.status(400).json({success: false, message: "Please enter information."})
	}

	console.log(req.connection.remoteAddress);
	console.log(req.get('host'));

	addTransaction(body.sender, body.recipient, body.amount);

    res.status(200).json({success: true, message: "Correct information."});
};

var addTransaction = function(sender, recipient, amount) {
	currentTransactions.push({
		'sender': sender,
		'recipient': recipient,
		'amount': amount
	});
};

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
};

var newBlock = function(proof, previousHash) {

	var d = new Date();
	var block = new Block(chain.length, d.getTime(), currentTransactions, proof, previousHash);
	currentTransactions = [];
	chain.push(block);
	return block;
 
};

exports.getChain = function(req, res) {
	
	res.status(200).json({
		chain: chain,
		length: chain.length
	});
};	

exports.consensus = function(req, res) {
	replaced = resolveConflicts();
	if(replaced == true){
		res.status(200).json({success: true, message: "Blockchain was replaced.", newChain: chain});
	}
	else{
		res.status(400).json({success: false, message: "Our chain is authoritative."});
	}

};

var validChain = function(newChain) {

	var prev = newChain[0];
	var i = 1;

	while(i < newChain.length) {

		var prevHash = calculateHash(prev);
		var currBlock = newChain[i];

		if(prevHash!=currBlock.previousHash)
			return false;
		if(!validProof(prev.proof, currBlock.proof))
			return false;

		prev = currBlock;
		i++;
	}
	return true;
};

var resolveConflicts = function() {

	maxLen = nodes.length;

	newChain = null;

	for(i=0;i<nodes.length;i++){
		request('http://' + nodes[i] + '/chain', function (error, response, body) {
			if(!response.length || !response.chain){
				return false;
			}
			if(response.length > maxLen && validChain(response.chain)){
				maxLen = response.length;
				newChain = response.chain;
			}

		});
	}
	if(newChain != null){
		chain = newChain;
		return true;
	}
	return false;

};

var lastBlock = function() {
	return (chain.length - 1);
};

var calculateHash = function(block) {
    return SHA256( JSON.stringify(block) ).toString();
};

var proofOfWork = function(lastProof) {
	proof = 0;
	while(validProof(lastProof, proof) == false) {
		console.log(proof);
		proof++;
	}
	return proof;

};

var validProof = function(lastProof, proof) {

	var guess = lastProof.toString() + proof.toString();
	guessHash = SHA256(guess).toString();
	return guessHash[guessHash.length-1] == '0';

};
