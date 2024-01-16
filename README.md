# TokenMaster NFT Ticketing System

## Overview

TokenMaster is an Ethereum-based NFT ticketing system built with Solidity, Hardhat, and OpenZeppelin contracts. It
allows event organizers to create and manage events, issue NFT-based tickets, and handle ticket sales and ownership
securely on the blockchain.

## Features

- Create and manage events with unique properties.
- Mint NFT tickets for each event.
- Ensure ticket authenticity and ownership.
- Withdraw funds securely.

## Prerequisites

- Node.js
- Yarn package manager
- Ethereum wallet with testnet ETH
- Hardhat

## Installation

```bash
git clone [repository URL]
cd [project directory]
yarn install
```

## Smart Contract Deployment

To deploy the TokenMaster contract, run:

```bash
yarn hardhat run scripts/deploy.ts --network [network name]
```

## Usage

### Setting Up Events

To set up an event, modify the `EventData.ts` file with event details and run the deployment script.

### Minting Tickets

Tickets can be minted through the `mint` function by specifying the event ID and seat number.

### Withdrawing Funds

The contract owner can withdraw collected funds using the `withdraw` function.

## Testing

Run tests using Hardhat:

```bash
yarn hardhat test
```

## Security

This project uses OpenZeppelin contracts for standard security practices in Ethereum development.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Disclaimer

This project is for educational purposes and should be used cautiously in a production setting.