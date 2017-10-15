# Blockchain
>**Blockchain is a digital ledger in which transactions made in bitcoin or another cryptocurrency are recorded chronologically and publicly.**

It's nothing but a public database that consists out of blocks that anyone can read. But, they do have an interesting property: they are immutable. Once a block has been added to the chain, it cannot be changed anymore without invalidating the rest of the chain.

This repository contains the code for basic prototype of blockchain. It implements basic concepts of blockchain like proof-of-work (POW), consensus algorithm, registering new nodes and many more. This repository serves as the api with the basic required functions for the implementation of blockchain. We can use the api to add transactions and mine the block.
Note, it doesn't contain the UI for adding transaction or mining the block.

Now, we can start with how this blockchain works. 

In blockchain, each block is stored with a timestamp and, optionally, an index.
Here's how a single block looks - 

```
block = {
    'index': 1,
    'timestamp': 1506057125.900785,
    'transactions': [
        {
            'sender': "8527147fe1f5426f9dd545de4b27ee00",
            'recipient': "a77f5cdfa2934df3954a5c7c7da5df1f",
            'amount': 5,
        }
    ],
    'proof': 324984774000,
    'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```
Each block contains a hash that is computed based on its contents. It also contains the hash of the previous block. It ensures the integrity of blockchain. For this purpose, I am using `crypto-js/sha256` library.

In order to add a transaction, we provide the data in the following format to body of post request on api `/transactions/new`.
 ```
{
	"sender":"sender's address",
	"recipient":"recipient's address",
	"amount":20
}
 ```
After we have added enough transactions, we need to mine a block which is done using get request on api `/mine`. We get the following response - 
```
{
    "message": "New block forged",
    "index": 1,
    "transactions": [
        {
            "sender": "sender's address 1",
            "recipient": "recipient's address 1",
            "amount": 20
        },
        {
            "sender": "sender's address 2",
            "recipient": "recipient's address 2",
            "amount": 20
        },
        {
            "sender": "sender's address 3",
            "recipient": "recipient's address 3",
            "amount": 20
        },
        {
            "sender": "0",
            "recipient": "miner's address",
            "amount": 1
        }
    ],
    "proof": 10,
    "previousHash": "0f8d2203dbd7c393f529f094390cbc1d392f2f047bef289f9b3758f2229b0af9"
}
```

If you want to register nodes, then use post request api `/register` using following data format on body - 
```
{
	"nodes": ["hostname:port"]
}
```

Whenever we connect to blockchain network, we need to retrieve the ledger from other nodes. And this is done using consensus algorithm. To do so, use get api `/resolve`. This will typically perform two functions -
1. retrieve chains from neighbours using get api `/chain`. (We can also use this method to retrieve our own blockchain)
2. applying consensus algorithm which is to choose longest chains of the all. Also, it checks the validity of chain by comparing previous hashes in each block with actual hash of the previous block.

Please refer to the code how these functions were implemeted. Hope it helps!

## Installation
1. Make sure you have [Nodejs](https://nodejs.org/en/download/) installed.
2. Using the below command install all required node modules.
```
$ npm install
```
3. Now, you can run the server using following command
```
$ npm run start
```
Our blockchain is running on `localhost:3000`.

## Contributing
Contributions are always welcome. Feel free to submit a pull request.
