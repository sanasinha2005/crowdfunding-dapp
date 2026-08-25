# Fundora — Decentralized Crowdfunding DApp

Fundora is a decentralized crowdfunding application built using React, Ethereum, Solidity, and Hardhat.

The application allows users to create crowdfunding campaigns, contribute ETH to campaigns, and withdraw funds when the campaign reaches its funding target.

## Features

- Connect wallet using MetaMask
- Create crowdfunding campaigns
- Set funding targets and deadlines
- View campaigns directly from the blockchain
- Donate ETH to campaigns
- Track campaign funding progress
- Track the connected user's contribution
- Switch MetaMask accounts dynamically
- Withdraw funds after reaching the campaign target
- Smart-contract validation for transactions
- Transaction status and error handling

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Ethers.js
- Lucide React

### Blockchain
- Solidity
- Hardhat
- Ethereum
- MetaMask

## Project Structure

```text
crowdfunding-dapp/
│
├── blockchain/
│   ├── contracts/
│   │   └── Crowdfunding.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── Crowdfunding.ts
│   └── hardhat.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── blockchain/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md