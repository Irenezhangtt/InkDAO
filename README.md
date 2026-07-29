<div align="center">

# InkDAO

### Community-owned publishing infrastructure for the next generation of writers

InkDAO combines programmable membership, tokenized curation, transparent prize
pools, and on-chain governance in a modular Ethereum protocol.

[![Live App](https://img.shields.io/badge/Live_App-Open_InkDAO-171816?style=for-the-badge)](https://irenezhangtt.github.io/memeDAO/)
[![Network](https://img.shields.io/badge/Network-Ethereum_Sepolia-5057D9?style=for-the-badge&logo=ethereum&logoColor=white)](https://sepolia.etherscan.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/Frontend-React-20232A?style=for-the-badge&logo=react)](https://react.dev/)

[Launch App](https://irenezhangtt.github.io/memeDAO/) ·
[Explore Contracts](./contracts) ·
[Review Test Evidence](#protocol-validation) ·
[Read the Roadmap](#roadmap)

</div>

---

## The protocol

Traditional publishing platforms concentrate discovery, ranking, monetization,
and editorial control in a small number of intermediaries. InkDAO explores a
different market structure: writers submit work, readers allocate attention and
voting power, and the community governs how shared capital is distributed.

The protocol is designed around four financial and operational primitives:

| Primitive | Purpose |
|---|---|
| **Programmable membership** | Converts participation fees into access, roles, and NVT voting tokens |
| **Tokenized curation** | Lets readers signal conviction through weighted, non-reusable contest votes |
| **Transparent prize pools** | Accumulates membership and submission fees for governed creator rewards |
| **On-chain governance** | Coordinates proposals, voting, parameter changes, and treasury execution |

InkDAO is a research prototype for decentralized content markets. It demonstrates
how smart contracts can align creator incentives, community participation, and
treasury accountability without relying on advertising or opaque ranking
algorithms.

## Product experience

The live application presents the complete protocol through six product areas:

- **Overview** — protocol thesis, metrics, active contest, and reader leaderboard
- **Membership** — wallet onboarding and the reader-to-author participation path
- **Novel Contest** — content discovery, IPFS-ready submissions, and NVT voting
- **Governance** — proposal creation, voting, quorum checks, and execution
- **Treasury** — revenue flows, prize pools, reserves, oracle, and DeFi research
- **Test Report** — Sepolia workflow evidence, gas benchmarks, and key findings

> [Open the public InkDAO application](https://irenezhangtt.github.io/memeDAO/)

## System architecture

InkDAO separates governance, financial operations, identity, and application
logic across six purpose-built contracts.

<p align="center">
  <img src="./docs/architecture.svg" alt="InkDAO protocol architecture" width="100%" />
</p>

The diagram separates community intent, governed execution, capital movement,
core protocol modules, and optional external infrastructure so each trust
boundary remains visible.

### Smart contracts

| Contract | Responsibility | Key controls |
|---|---|---|
| [`NovelToken.sol`](./contracts/NovelToken.sol) | ERC-20 participation and voting asset | Authorized minting, user burns |
| [`Membership.sol`](./contracts/Membership.sol) | Paid membership registry | Authorized grant and revocation |
| [`RoleManager.sol`](./contracts/RoleManager.sol) | Reader, author, and administrator permissions | Manager and owner controls |
| [`ContestManager.sol`](./contracts/ContestManager.sol) | Contest lifecycle, submissions, voting, and Top 3 | Owner/Governor execution |
| [`Treasury.sol`](./contracts/Treasury.sol) | Payments, pricing, prize pools, and rewards | Governor-controlled parameters |
| [`Governor.sol`](./contracts/Governor.sol) | Proposal coordination and approved execution | Threshold, quorum, voting period |

## Economic model

InkDAO models a circular creator economy:

```text
Membership + token purchases + submission fees
                         │
                         ▼
                DAO Treasury / Prize Pool
                         │
                 community governance
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
       Top-three writers      Protocol reserve
```

### NVT utility

`NVT` is the protocol's participation token. In the tested model it provides:

- contest voting power;
- governance proposal and voting power;
- an auditable participation mechanism;
- a burn-based contest vote that prevents the same tokens from being reused.

NVT is an experimental protocol token, not a representation of equity, debt,
profit rights, or a guaranteed financial return.

### Revenue and capital flows

- Membership payments onboard new readers and contribute to contest capital.
- Optional token purchases expand a member's participation capacity.
- Submission fees align creators with the active contest prize pool.
- Governed distributions reward the Top 3 submissions.
- A platform reserve supports continued protocol operation.
- Chainlink price data was used to research stable USD-denominated fee inputs.
- Aave integration was explored as an optional idle-treasury strategy.

Oracle and lending components are prototype research and are not presented as
production yield products.

## End-to-end lifecycle

1. Deploy the six contracts in dependency order.
2. Assign Treasury manager and token-minter permissions.
3. Connect Governor, Treasury, and ContestManager.
4. Create a time-bound writing contest.
5. Purchase membership and receive NVT.
6. Register a member as an author.
7. Submit a title and off-chain content URI.
8. Approve and commit NVT to a contest vote.
9. Close voting and finalize the Top 3 submissions.
10. Propose and approve reward distribution through governance.
11. Execute the proposal and settle author rewards.

## Protocol validation

The complete workflow was deployed and exercised on Ethereum Sepolia with
multiple wallets. The test sequence covered contract deployment, permission
configuration, onboarding, submissions, token approvals, voting, winner
selection, governance, and reward settlement.

### Gas benchmarks

| Function | Contract | Gas used |
|---|---|---:|
| `createContest()` | ContestManager | 127,263 |
| `submitNovel()` | ContestManager | 263,118 |
| `vote()` | ContestManager | 97,227 |
| `finalizeWinner()` | ContestManager | 98,859 |
| `registerAsAuthor()` | Treasury | 65,959 |
| `purchaseMembership()` | Treasury | 166,188 |
| `buyExtraTokens()` | Treasury | 88,289 |
| `supplyIdleEthToAave()` | Treasury | 235,366 |
| `propose()` | Governor | 235,233 |
| `vote()` | Governor | 94,349 |
| `execute()` | Governor | 321,822 |

Governance execution was the most expensive measured operation because it
combines state changes with an external contract call. Submission, lending, and
proposal creation were the next most computationally intensive flows.

### Observed Sepolia fees

| Action | Transaction fee |
|---|---:|
| Purchase membership | 0.00024928 ETH |
| Register as author | 0.00009893 ETH |
| Submit novel | 0.00039467 ETH |
| Vote for novel | 0.00014583 ETH |
| Finalize winner | 0.00014828 ETH |
| Propose reward distribution | 0.00035284 ETH |
| Vote on reward distribution | 0.00014152 ETH |
| Execute reward distribution | 0.00048273 ETH |

Sepolia ETH has no production value. These figures document historical test
execution and should not be treated as estimates of current testnet or mainnet
costs.

## Sepolia contract archive

| Contract | Address |
|---|---|
| NovelToken | [`0x4f74...fCa0`](https://sepolia.etherscan.io/address/0x4f74E67b0966CafD478ADEe7Ce42C6fE72f8fCa0) |
| Membership | [`0xf580...bE37`](https://sepolia.etherscan.io/address/0xf580DB362F1650Ec87e76cB64a01D17ca84ebE37) |
| RoleManager | [`0xF6Fe...61C2`](https://sepolia.etherscan.io/address/0xF6FeA9b3147dA656C6397C4408eEFd24E1E961C2) |
| ContestManager | [`0xD272...8542`](https://sepolia.etherscan.io/address/0xD272f160B616C43E4084c045EDE7f477aaeb8542) |
| Treasury | [`0xcD3f...5dA8`](https://sepolia.etherscan.io/address/0xcD3f2f5438562735a792d17Fe1bD8205963D5dA8) |
| Governor | [`0xeB9A...9895`](https://sepolia.etherscan.io/address/0xeB9Af9D5A924d9F90D424832C6F0783C82a69895) |

These addresses are retained as a public test archive. New deployments should
use environment-specific addresses rather than assuming that archived contracts
remain active.

## Technology

| Layer | Stack |
|---|---|
| Blockchain | Ethereum / Sepolia |
| Smart contracts | Solidity, OpenZeppelin |
| Wallet interface | MetaMask, EIP-1193 |
| Frontend | React 18 |
| Web3 client | ethers.js 6 |
| Oracle research | Chainlink ETH/USD |
| Treasury research | Aave |
| Content storage model | IPFS-compatible URI references |
| Public hosting | GitHub Pages |

## Local development

### Requirements

- Node.js 20 or newer
- npm
- MetaMask or another EIP-1193 wallet
- Sepolia ETH for test transactions

### Installation

```bash
git clone https://github.com/Irenezhangtt/memeDAO.git
cd memeDAO
npm install
cp .env.example .env
npm start
```

The application opens at `http://localhost:3000`.

### Environment configuration

```env
REACT_APP_CONTEST_MANAGER_ADDRESS=
REACT_APP_MEMBERSHIP_ADDRESS=
REACT_APP_NOVEL_TOKEN_ADDRESS=
REACT_APP_ROLE_MANAGER_ADDRESS=
REACT_APP_TREASURY_ADDRESS=
REACT_APP_GOVERNOR_ADDRESS=
```

Only public contract addresses belong in the frontend environment. Never place
wallet private keys, seed phrases, RPC administrator secrets, or deployer
credentials in a React environment variable.

### Build and publish

```bash
npm run build
npm run deploy:pages
```

## Security posture

InkDAO is a research and demonstration project. The contracts have **not** been
independently audited and should not custody production funds.

Before a production deployment:

- migrate governance voting power to snapshot-based `ERC20Votes`;
- introduce Timelock-controlled execution;
- replace broad owner privileges with governance or multisig controls;
- add reentrancy protection and pull-based reward withdrawals where applicable;
- validate Chainlink feed freshness, decimals, and network-specific addresses;
- restrict and cap any external lending allocation;
- add invariant, fuzz, access-control, and fork tests;
- optimize winner selection to avoid unbounded on-chain iteration;
- commission an independent smart-contract security audit;
- complete jurisdiction-specific legal, consumer-protection, and token review.

See [`SECURITY.md`](./SECURITY.md) for responsible disclosure guidance once a
production security contact is established.

## Roadmap

- [x] Modular six-contract protocol
- [x] Membership and role-based participation
- [x] Token-weighted novel contests
- [x] Top-three winner finalization
- [x] Treasury-funded reward workflow
- [x] DAO proposal, voting, and execution
- [x] Sepolia multi-wallet validation
- [x] Chainlink price conversion research
- [x] Aave treasury integration research
- [x] Public responsive web application
- [ ] ERC20Votes and Timelock governance upgrade
- [ ] IPFS upload and content retrieval
- [ ] Automated Hardhat contract test suite
- [ ] Gas regression and fork testing
- [ ] Multisig-controlled deployment process
- [ ] Independent security audit
- [ ] Production network evaluation

## Repository structure

```text
.
├── contracts/          Solidity protocol contracts
├── public/             Static web assets and social preview
├── src/
│   ├── abi/            Contract ABIs
│   ├── components/     Product and Web3 interface components
│   └── utils/          Contract clients and formatting helpers
├── .env.example        Public address configuration template
└── README.md           Protocol documentation
```

## Research background

InkDAO was created as a full-stack blockchain and cryptocurrency research
project by Jiaying Xie and Yutong Zhang. The prototype investigated how a
decentralized autonomous organization can coordinate creative discovery,
community voting, programmable rewards, transparent treasury management, oracle
pricing, and DeFi integrations in one coherent system.

## Disclaimer

InkDAO is experimental software provided for research, education, and
demonstration. It is not financial, investment, legal, or tax advice. NVT has no
guaranteed value, return, liquidity, or redemption right. Smart-contract and
blockchain interactions can result in permanent loss. Review the code, test on a
supported testnet, and obtain independent professional advice before adapting
the system for production use.

---

<div align="center">

**InkDAO — writers create, readers decide, the protocol settles.**

[Launch the app](https://irenezhangtt.github.io/memeDAO/) ·
[View on GitHub](https://github.com/Irenezhangtt/memeDAO)

</div>
