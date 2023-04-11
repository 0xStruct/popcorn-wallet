# Popcorn wallet

Embedded wallet to deliver web2 UX for web3 games

Powered by:
Gnosis Safe, Web3Auth, Gelato, Ramp, Covalent

## Installation

To run this project locally:

Install deps:

```bash
yarn install
```

Create a `.env` file (see `example.env`)

```
# see https://web3auth.io/docs/developer-dashboard/get-client-id
REACT_APP_WEB3AUTH_CLIENT_ID=

REACT_APP_STRIPE_BACKEND_BASE_URL=

REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51MZbmZKSn9ArdBimSyl5i8DqfcnlhyhJHD8bF2wKrGkpvNWyPvBAYtE211oHda0X3Ea1n4e9J9nh2JkpC7Sxm5a200Ug9ijfoO

REACT_APP_COVALENT_API_KEY=

REACT_APP_GELATO_RELAYER_KEY=

```

Run the demo App:

```bash
yarn start
```

## What it does
With Popcorn, web3 games are just like web2 games. Users login using their emails or social accounts. They start playing the games without needing to know about crypto wallets.

Corresponding EOA accounts and smart contract accounts are created in the background. Users enjoy the game experience without needing to setup wallets and clicking for approvals. Users can add game credits (i.e tokens) by buying in with fiat payment networks (i.e Stripe, Ramp network, etc). In-game items (I.e NFTs) can be transferred in and out to users’ embedded wallets (without users needing to learn about crypto wallets).

Eventually, when users are ready, they can take full custody of their wallets. If they don’t want to, they don’t need to know about the wallets at all, game credits (or tokens) and items (or NFTs) can be seamlessly on-ramped and off-ramped without users ever touching their wallets.

## How it is built
Total of 5 different web3 services are used to deliver the seamless embedded wallet experience.

#1 Web3Auth is used to allow users to login with emails and social accounts. An EOA account is created and linked to the user’s login. This account is fully custodied by the user’s login via multi-party computing.

#2 With Gnosis Safe, a smart contract account is created with the earlier EOA account. This is also known as Account Abstraction which bring lots of capabilities and better UX. On-chain transactions now can happen without user needing to approve for every transaction.

#3 Moreover, with Gelato Relay, transaction gas fees can now be sponsored by the game. This enables user to start interacting with the game without having any game credits (or tokens) first. With relayer, gas fees can be paid with other ERC20 tokens without requiring chain’s native token. Have your ever experienced running out of ETH in the wallet to do a transaction?

#4 To bridge the gap between fiat and on-chain currency, fiat on-ramp is demo’ed using Stripe and Ramp network. This can be used for off-ramp as well for users to cash out their game credits (or tokens) and items (or NFTs).

#5 Covalent APIs are used to list out the embedded wallets’ token and NFT balances as well as recent transactions.
