# InkDAO

InkDAO is a decentralized publishing protocol that brings independent writers
and readers together. Readers purchase membership, receive NVT participation
tokens, vote in writing contests, and govern reward distribution. Writers
register as creators and submit off-chain content references for transparent
community evaluation.

## Platform

The frontend includes:

- Protocol overview and live Sepolia contract references
- Membership and reader/author role model
- Novel contest discovery, submission, and voting flows
- On-chain proposal creation, voting, and execution
- Treasury, Chainlink pricing, and Aave research overview
- The complete 2026 Sepolia test report and gas benchmarks

## Architecture

InkDAO uses six modular contracts:

1. `NovelToken.sol` — ERC-20 participation and governance token
2. `Membership.sol` — paid membership registry
3. `RoleManager.sol` — reader, author, and administrator permissions
4. `ContestManager.sol` — submissions, token voting, and top-three selection
5. `Treasury.sol` — payments, prize pools, rewards, oracle, and lending research
6. `Governor.sol` — proposals, community voting, and approved execution

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm start
```

Create `.env` from `.env.example` to replace the archived Sepolia addresses.
Never commit wallet private keys; the frontend only asks MetaMask to sign
transactions in the browser.

## Production build

```bash
npm run build
```

The optimized static site is written to `build/`.

## Test provenance

The test report documents the original end-to-end Sepolia execution: deployment,
permission configuration, membership purchase, author registration, novel
submission, NVT approval and voting, winner finalization, governance proposal,
execution, and reward distribution.
