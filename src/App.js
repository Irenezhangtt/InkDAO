import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import Governance from "./components/Governance";
import { CONTRACT_ADDRESSES } from "./utils/contracts";
import { shortenAddress } from "./utils/format";

const navItems = [
  ["overview", "◫", "Overview"],
  ["membership", "◇", "Membership"],
  ["contest", "✦", "Novel Contest"],
  ["governance", "⌁", "Governance"],
  ["treasury", "◎", "Treasury"],
  ["proof", "▤", "Test Report"],
];

const novels = [
  { rank: 1, title: "The Last Library on Earth", author: "0x8f2...91c", votes: "428 NVT", tone: "indigo", initials: "LL" },
  { rank: 2, title: "Letters From a Borrowed Moon", author: "0xa14...e72", votes: "361 NVT", tone: "coral", initials: "LM" },
  { rank: 3, title: "The City That Remembered Rain", author: "0x73b...4df", votes: "294 NVT", tone: "mint", initials: "CR" },
];

const gasRecords = [
  ["createContest()", "ContestManager", "127,263"],
  ["submitNovel()", "ContestManager", "263,118"],
  ["vote()", "ContestManager", "97,227"],
  ["finalizeWinner()", "ContestManager", "98,859"],
  ["purchaseMembership()", "Treasury", "166,188"],
  ["supplyIdleEthToAave()", "Treasury", "235,366"],
  ["propose()", "Governor", "235,233"],
  ["execute()", "Governor", "321,822"],
];

function App() {
  const [tab, setTab] = useState("overview");
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      notify("MetaMask was not found. Install it to connect.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0] || "");
      setChainId(network.chainId.toString());
      notify(network.chainId === 11155111n ? "Wallet connected to Sepolia." : "Wallet connected. Switch to Sepolia to interact.");
    } catch (error) {
      notify(error?.shortMessage || "Wallet connection was cancelled.");
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const onAccountsChanged = (accounts) => setAccount(accounts[0] || "");
    const onChainChanged = (id) => setChainId(BigInt(id).toString());
    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    window.ethereum.on?.("chainChanged", onChainChanged);
    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setTab("overview")}>
          <span className="brand-mark">i</span>
          <span>InkDAO</span>
        </button>
        <nav>
          {navItems.map(([id, icon, label]) => (
            <button key={id} className={tab === id ? "nav-item active" : "nav-item"} onClick={() => setTab(id)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="network-card">
          <span className="live-dot" />
          <div><strong>Sepolia archive</strong><small>Contracts deployed & tested</small></div>
        </div>
        <p className="sidebar-note">A DAO that brings<br />writers and readers together.</p>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">i</span>InkDAO</div>
          <span className="network-label"><i />{chainId === "11155111" ? "Ethereum Sepolia" : "InkDAO protocol"}</span>
          <button className={account ? "wallet connected" : "wallet"} onClick={connectWallet}>
            {account ? shortenAddress(account) : "Connect wallet"}
          </button>
        </header>
        <div className="content">
          {tab === "overview" && <Overview setTab={setTab} notify={notify} />}
          {tab === "membership" && <Membership account={account} connectWallet={connectWallet} notify={notify} />}
          {tab === "contest" && <Contest account={account} setTab={setTab} notify={notify} />}
          {tab === "governance" && <GovernancePage account={account} />}
          {tab === "treasury" && <Treasury />}
          {tab === "proof" && <Proof />}
        </div>
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function Overview({ setTab, notify }) {
  return (
    <>
      <section className="hero">
        <span className="kicker">DECENTRALIZED PUBLISHING PROTOCOL</span>
        <h1>Stories belong to<br /><em>the people who read them.</em></h1>
        <p>InkDAO connects independent writers with a community of readers who discover, vote for, and reward the stories that deserve to be published.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setTab("contest")}>Discover stories <span>↗</span></button>
          <button className="text-button" onClick={() => setTab("membership")}>Become a member <span>→</span></button>
        </div>
        <div className="book-object"><div><b>INK</b><small>01 / GENESIS</small></div><i /><i /></div>
      </section>

      <section className="metrics">
        <Metric label="Voting token" value="NVT" note="ERC-20 participation token" />
        <Metric label="Core contracts" value="6" note="Modular protocol architecture" />
        <Metric label="Contest winners" value="Top 3" note="Governed reward distribution" />
        <Metric label="Test coverage" value="11 steps" note="Completed on Sepolia" />
      </section>

      <div className="section-heading">
        <div><span className="kicker">CURRENT CONTEST</span><h2>Genesis Writing Prize</h2></div>
        <button className="text-button" onClick={() => setTab("contest")}>See all submissions →</button>
      </div>
      <section className="dashboard-grid">
        <div className="contest-feature panel">
          <div className="panel-top"><span className="status-pill">● VOTING OPEN</span><span>Round 01</span></div>
          <h3>Readers decide<br />what rises.</h3>
          <p>Use NVT to support a novel. Votes are committed to the contest and cannot be reused.</p>
          <div className="countdown"><span>Voting closes in</span><strong>02 : 14 : 36 : 09</strong></div>
          <button className="primary full" onClick={() => setTab("contest")}>Enter the contest <span>→</span></button>
        </div>
        <div className="panel leaderboard">
          <div className="panel-top"><span className="kicker">READER&apos;S CHOICE</span><span>Top three</span></div>
          {novels.map((novel) => (
            <button key={novel.rank} onClick={() => notify(`${novel.title} opened in preview mode.`)}>
              <span className={`cover-mini ${novel.tone}`}>{novel.initials}</span>
              <span><b>{novel.title}</b><small>{novel.author}</small></span>
              <strong>{novel.votes}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="principles">
        <div><span>01</span><h3>Community curation</h3><p>Readers replace opaque recommendation algorithms with transparent token voting.</p></div>
        <div><span>02</span><h3>Creator ownership</h3><p>Writers submit off-chain content references while authorship and results remain on-chain.</p></div>
        <div><span>03</span><h3>Governed rewards</h3><p>The community approves prize distribution through proposal, vote, and execution.</p></div>
      </section>
    </>
  );
}

function Metric({ label, value, note }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function Membership({ account, connectWallet, notify }) {
  return (
    <>
      <PageHead kicker="JOIN THE READING ROOM" title="Membership" description="Membership unlocks reader voting, creator registration, and participation in InkDAO governance." />
      <section className="membership-grid">
        <div className="membership-pass">
          <div className="pass-top"><span>INKDAO</span><span>MEMBER PASS</span></div>
          <strong>READER<br />01</strong>
          <div className="pass-bottom"><span>{account ? shortenAddress(account) : "NOT CONNECTED"}</span><span>SEPOLIA</span></div>
        </div>
        <div className="join-panel">
          <span className="status-pill">GENESIS MEMBERSHIP</span>
          <h2>Enter as a reader.<br />Grow into a creator.</h2>
          <p>Membership purchase grants the reader role and mints three NVT participation tokens. Members may then register as authors without centralized approval.</p>
          <div className="benefits"><span>✓ Reader voting</span><span>✓ 3 NVT tokens</span><span>✓ Creator registration</span><span>✓ Governance access</span></div>
          <button className="primary full" onClick={account ? () => notify("Membership transaction is ready for contract connection.") : connectWallet}>{account ? "Purchase membership" : "Connect wallet to join"} <span>↗</span></button>
        </div>
      </section>
      <section className="role-grid"><div><b>Reader</b><p>Discover submissions and commit voting tokens to the stories you support.</p></div><div><b>Author</b><p>Submit a title and IPFS content URI to an active writing contest.</p></div><div><b>Governor</b><p>Create proposals, vote on protocol actions, and execute approved decisions.</p></div></section>
    </>
  );
}

function Contest({ account, setTab, notify }) {
  const [title, setTitle] = useState("");
  const submit = () => {
    if (!account) return notify("Connect your wallet before submitting.");
    if (!title.trim()) return notify("Add a novel title first.");
    notify(`“${title}” is ready for on-chain submission.`);
    setTitle("");
  };
  return (
    <>
      <PageHead kicker="ROUND 01 · GENESIS" title="Novel Contest" description="Writers submit. Readers vote. The top three authors share the community-funded prize pool." action="View rules" onAction={() => notify("One membership, one creator profile, token-weighted reader voting.")} />
      <div className="contest-banner"><span>VOTING ENDS IN</span><strong>02 : 14 : 36 : 09</strong><small>Community prize pool · Sepolia archive</small></div>
      <section className="novel-grid">
        {novels.map((novel) => (
          <article className="novel-card" key={novel.rank}>
            <div className={`book-cover ${novel.tone}`}><small>INKDAO · 01</small><b>{novel.initials}</b><span>#{novel.rank}</span></div>
            <div className="novel-info"><h3>{novel.title}</h3><p>Written by {novel.author}</p><strong>{novel.votes}</strong></div>
            <button onClick={() => account ? notify(`Vote prepared for ${novel.title}.`) : notify("Connect your wallet to vote.")}>Support with NVT</button>
          </article>
        ))}
      </section>
      <section className="submission-panel">
        <div><span className="kicker">CREATOR DESK</span><h2>Submit your work.</h2><p>The story stays off-chain; its title, creator, URI, and community result remain verifiable.</p></div>
        <div><label>Novel title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A title readers will remember" /><label>Content URI</label><input placeholder="ipfs://..." /><button className="primary" onClick={submit}>Prepare submission ↗</button></div>
      </section>
      <button className="governance-link" onClick={() => setTab("governance")}>Contest actions are governed. View proposals →</button>
    </>
  );
}

function GovernancePage({ account }) {
  return (
    <>
      <PageHead kicker="COMMUNITY DECISION-MAKING" title="Governance" description="Propose contest actions, vote with NVT, and execute decisions that meet quorum." />
      <section className="governance-summary"><Metric label="Proposal threshold" value="1 NVT" note="Minimum balance to propose" /><Metric label="Quorum" value="Configurable" note="Governance controlled" /><Metric label="Execution" value="On-chain" note="Target + calldata" /></section>
      <div className="legacy-governance"><Governance account={account} /></div>
    </>
  );
}

function Treasury() {
  return (
    <>
      <PageHead kicker="THE ECONOMIC CORE" title="Treasury" description="Memberships, token purchases, submission fees, prize pools, and governed rewards meet in one transparent contract." />
      <section className="treasury-hero">
        <div><span>SEPOLIA TREASURY</span><strong>Verified workflow</strong><p>Membership → prize pool → governed distribution</p><a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESSES.treasury}`} target="_blank" rel="noreferrer">View contract ↗</a></div>
        <div className="treasury-orbit"><b>◎</b><span>ON-CHAIN</span></div>
      </section>
      <section className="fund-flow">
        {[
          ["Membership", "ETH payment grants access and participation tokens."],
          ["Submissions", "Creator fees are recorded in the contest prize pool."],
          ["Rewards", "Top-three payouts execute after governance approval."],
          ["Reserve", "A platform share stays in the DAO treasury."],
          ["Chainlink", "USD-denominated fees convert using an ETH/USD price feed."],
          ["Aave", "Idle-fund lending was demonstrated as a treasury extension."],
        ].map(([title, body]) => <div key={title}><span>↘</span><h3>{title}</h3><p>{body}</p></div>)}
      </section>
    </>
  );
}

function Proof() {
  return (
    <>
      <PageHead kicker="INKDAO SYSTEM REPORT · 2026" title="Tested end to end." description="The complete InkDAO workflow was deployed and exercised with multiple wallets on Ethereum Sepolia." />
      <section className="proof-status"><div><span>OVERALL RESULT</span><strong>PASS</strong></div><div><span>CONTRACTS</span><strong>6 deployed</strong></div><div><span>WORKFLOW</span><strong>11 steps</strong></div><div><span>MEASUREMENTS</span><strong>12 gas records</strong></div></section>
      <section className="test-flow">
        {["Deploy contracts", "Configure permissions", "Create contest", "Purchase membership", "Register author", "Submit novel", "Approve NVT", "Vote for novels", "Finalize top three", "Govern rewards", "Distribute prizes"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b><i>✓</i></div>)}
      </section>
      <div className="section-heading report-heading"><div><span className="kicker">MEASURED ON SEPOLIA</span><h2>Gas cost breakdown</h2></div><span>Historical execution record</span></div>
      <section className="gas-table"><div className="gas-row gas-head"><span>Function</span><span>Contract</span><span>Gas used</span></div>{gasRecords.map(([fn, contract, gas]) => <div className="gas-row" key={fn}><b>{fn}</b><span>{contract}</span><strong>{gas}</strong></div>)}</section>
      <section className="findings">
        <div><span className="kicker">PROVED</span><h3>Community loop</h3><p>Real wallets completed onboarding, creation, curation, settlement, and governed reward distribution.</p></div>
        <div><span className="kicker">OBSERVED</span><h3>Execution costs most</h3><p>Governance execution reached 321,822 gas because it combines storage updates and external calls.</p></div>
        <div><span className="kicker">NEXT</span><h3>Production hardening</h3><p>ERC20Votes snapshots, Timelock execution, IPFS, optimized ranking, and an independent audit.</p></div>
      </section>
      <a className="report-source" href="https://github.com/Irenezhangtt/InkDAO" target="_blank" rel="noreferrer">Explore the contracts and original test implementation on GitHub ↗</a>
    </>
  );
}

function PageHead({ kicker, title, description, action, onAction }) {
  return <div className="page-head"><div><span className="kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>{action && <button className="primary" onClick={onAction}>{action} ↗</button>}</div>;
}

export default App;
