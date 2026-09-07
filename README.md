# Avalanche Launch Token

A small, verifiable Avalanche DApp built for the Team1 Avalanche Builder Launchpad. It lets a connected wallet deploy a fixed-supply ERC-20 contract to Avalanche Fuji and links directly to the resulting transaction and contract on Snowtrace.

## Live on Avalanche Fuji

| Item | Value |
| --- | --- |
| Network | Avalanche Fuji C-Chain (`43113`) |
| Contract | `LaunchToken` (`AVLT`) |
| Supply | `100,000 AVLT` minted once to the initial holder |
| Contract address | [`0x2e13c18fabf0085fa57dc3094b7a877a80585058`](https://testnet.snowtrace.io/address/0x2e13c18fabf0085fa57dc3094b7a877a80585058) |
| Deployment transaction | [`0xda6aa329d984b23736d4ae0b41f275e0105e4075c5cf21d9f20d06f406caf44f`](https://testnet.snowtrace.io/tx/0xda6aa329d984b23736d4ae0b41f275e0105e4075c5cf21d9f20d06f406caf44f) |
| Deployment block | `58143963` |

> This project uses testnet assets only. `AVLT` has no financial value.

## What it demonstrates

- A custom Solidity ERC-20 contract built with OpenZeppelin.
- A deterministic deployment script and contract tests.
- Avalanche Fuji network configuration with burner wallets disabled.
- A Next.js wallet UI that deploys `LaunchToken` from the user's wallet.
- Confirmation and Snowtrace links after deployment.

## Contract

[`packages/hardhat/contracts/LaunchToken.sol`](packages/hardhat/contracts/LaunchToken.sol) mints the complete fixed supply in its constructor:

```solidity
contract LaunchToken is ERC20 {
    constructor(address initialHolder) ERC20("Avalanche Launch Token", "AVLT") {
        _mint(initialHolder, 100_000 ether);
    }
}
```

There is no owner-only mint function, transfer tax, blacklist, or upgrade path.

## Stack

- Solidity `0.8.30`
- OpenZeppelin Contracts
- Hardhat
- Next.js, React, TypeScript
- Wagmi, Viem, RainbowKit
- Scaffold-ETH 2

## Run locally

Requirements: Node.js `>=22.10.0` and Yarn 4.

```bash
yarn install
yarn compile
yarn test
yarn start
```

Open <http://localhost:3000>, connect a wallet on Avalanche Fuji, and deploy. The wallet pays testnet gas and receives the initial token supply.

## Verify

```bash
yarn compile
yarn test
yarn lint
yarn next:build
```

Current automated contract coverage verifies metadata, fixed supply allocation, and transfers.

## Project structure

```text
packages/hardhat/contracts/LaunchToken.sol       Solidity contract
packages/hardhat/deploy/01_deploy_launch_token.ts Deployment script
packages/hardhat/test/LaunchToken.ts             Contract tests
packages/nextjs/app/page.tsx                     Fuji deployment UI
packages/nextjs/scaffold.config.ts                Frontend network config
```

Built by [`Lukeknow0`](https://github.com/Lukeknow0) for the Avalanche Builder Launchpad.
