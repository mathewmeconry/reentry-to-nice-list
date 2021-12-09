# reentry-to-nice-list
This is a challenge for the Hackvent 2021.

## Description
The elves are going web3!
Also, Santa needs money to produce the toys (did you really think anything is for free?!). To don't be a boomer and raise more than the ConstitutionDAO he tasks his elves to create a smart contract for people to buy into the nice list.

Unfortunately, the elves weren't up to the task and only were able to put the deeds counter on to the blockchain.
You have to submit one good deed per month to get on to the nice list.

Unluckily for you, Christmas is in a few days and you can only submit 1 deed at a month (or in blockchain terms: every 172800 blocks)
Or can you get your counter to 0 in time?

More Information to start:
- Contract address: 0x73D81979766A4076e73Da18786df983A80a86212
- Network used: Etherum Rinkeby (Test Network)
- Create a Wallet: use the metamask browser extension
- Get some ETH: [https://faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby) or [https://faucet.rinkeby.io/](https://faucet.rinkeby.io/)

## Vulnerability
The contract is vulnerable to a reentry attack [https://quantstamp.com/blog/what-is-a-re-entrancy-attack](https://quantstamp.com/blog/what-is-a-re-entrancy-attack)

## How To Setup
### Contract
- install dependencies `yarn`
- run the deploy script `yarn run deploy`

### IsNice validator
This validator queries the contract and checks if the user is nice.
- install dependencies `yarn`
- build the typescript stuff `yarn run build`
- start the server `yarn start`

## How To Solve
You need to setup an attacker contract in order to exploit the reentry attack. An example can be found in `contracts/Attacker.sol`.
