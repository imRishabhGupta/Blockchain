const SHA256 = require("js-sha256");

module.exports = class Blockchain{

	constructor() {
		this.chain = [];
		this.newBlock(100, 1);
	}

	newTransaction(sender, recipient, amount) {

		this.currentTransactions.push({
			'sender': sender;
			'recipient': recipient;
			'amount': amount;
		});

		return lastBlock() + 1;
	}

	newBlock(proof, previousHash) {

		var block = new Block(this.chain.length, time(), this.currentTransactions, proof, previousHash);
		this.currentTransactions = [];
		this.chain.push(block);
		return block;

	}

	lastBlock() {
		return this.chain.length - 1;
	}

    calculateHash(block) {

        var sha = SHA256.create();
    	sha.update( JSON.stringify(block) );
    	return sha.hex();

    }

}