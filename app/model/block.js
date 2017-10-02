module.exports = class Block {

    constructor(index, timestamp, data, proof, previousHash) {
        this.index = index;
        this.previousHash = previousHash;
        this.proof = proof;
        this.timestamp = timestamp;
        this.data = data;
    }

}
