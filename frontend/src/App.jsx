import { useEffect, useState } from "react";
import { getContract, getSigner } from "./blockchain/contract";
import { ethers } from "ethers";
import CampaignCard from "./components/CampaignCard";

import {
  ArrowRight,
  ArrowUpRight,
  Wallet,
  Sparkles,
} from "lucide-react";


function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");

  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [target, setTarget] = useState("");
const [duration, setDuration] = useState("");
const [creating, setCreating] = useState(false);

const createCampaign = async () => {
  try {
    if (!title || !description || !target || !duration) {
      alert("Please fill all fields.");
      return;
    }

    setCreating(true);

    const contract = await getContract(true);

    const targetInWei = ethers.parseEther(target);

    const tx = await contract.createCampaign(
      title,
      description,
      targetInWei,
      duration
    );

    console.log("Transaction sent:", tx.hash);

    await tx.wait();

    console.log("Campaign created successfully!");

    setTitle("");
    setDescription("");
    setTarget("");
    setDuration("");

    // Reload campaigns
    const updatedCampaigns = await contract.getAllCampaigns();

    const formattedCampaigns = updatedCampaigns.map(
      (campaign, index) => ({
        id: index,
        title: campaign.title,
        description: campaign.description,
        owner: campaign.owner,
        target: campaign.target,
        deadline: campaign.deadline,
        amountCollected: campaign.amountCollected,
        withdrawn: campaign.withdrawn,
      })
    );

    setCampaigns(formattedCampaigns);

    alert("Campaign created successfully!");
  } catch (error) {
    console.error("Campaign creation failed:", error);
    alert("Failed to create campaign.");
  } finally {
    setCreating(false);
  }
};

useEffect(() => {
  const loadCampaigns = async () => {
    try {
      const contract = await getContract(false);
      const data = await contract.getAllCampaigns();

      const formattedCampaigns = data.map((campaign, index) => ({
        id: index,
        title: campaign.title,
        description: campaign.description,
        owner: campaign.owner,
        target: campaign.target,
        deadline: campaign.deadline,
        amountCollected: campaign.amountCollected,
        withdrawn: campaign.withdrawn,
      }));

      setCampaigns(formattedCampaigns);
      console.log("Blockchain campaigns:", formattedCampaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  loadCampaigns();
}, []);

const connectWallet = async () => {
  try {
    const signer = await getSigner();
    const address = await signer.getAddress();

    setAccount(address);
    console.log("Connected account:", address);
  } catch (error) {
    console.error("Wallet connection failed:", error);
  }
};
  return (
    <div className="min-h-screen bg-[#08090d] text-white">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b border-white/10 bg-[#08090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
              <Sparkles size={20} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Fundora
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a
              href="#explore"
              className="transition hover:text-white"
            >
              Explore
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
          </div>

          {/* Wallet */}
          <button
  onClick={connectWallet}
  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
>
  <Wallet size={17} />
  {account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "Connect Wallet"}
</button>

        </div>
      </nav>


      {/* ================= MAIN ================= */}
      <main>

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden">

          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">

            <div className="mx-auto max-w-4xl text-center">

              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                <Sparkles size={15} />
                Powered by Blockchain
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
                Fund ideas.
                <br />

                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Build the future.
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl">
                Discover innovative projects and support creators directly.
                Transparent, decentralized crowdfunding powered by smart
                contracts.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                <button className="group flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:scale-[1.02] hover:bg-gray-200">
                  Explore Campaigns

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="mt-10 mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">

  <h3 className="text-2xl font-semibold">
    Start a Campaign
  </h3>

  <p className="mt-2 text-sm text-gray-400">
    Create a campaign directly on the blockchain.
  </p>

  <div className="mt-6 space-y-4">

    <input
      type="text"
      placeholder="Campaign title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
    />

    <textarea
      placeholder="Campaign description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
    />

    <input
      type="number"
      step="0.01"
      placeholder="Funding target (ETH)"
      value={target}
      onChange={(e) => setTarget(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
    />

    <input
      type="number"
      placeholder="Duration (days)"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
    />

    <button
      onClick={createCampaign}
      disabled={creating}
      className="w-full rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
    >
      {creating ? "Creating..." : "Create Campaign"}
    </button>

  </div>

</div>

              </div>

            </div>


            {/* Stats */}
            <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">

              <div className="p-6 text-center">
                <p className="text-3xl font-bold">184</p>
                <p className="mt-1 text-sm text-gray-500">
                  Campaigns
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="text-3xl font-bold">2.4K</p>
                <p className="mt-1 text-sm text-gray-500">
                  Backers
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="text-3xl font-bold">32 ETH</p>
                <p className="mt-1 text-sm text-gray-500">
                  Total Raised
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ================= FEATURED CAMPAIGNS ================= */}
        <section
          id="explore"
          className="border-t border-white/10 bg-[#0b0c11]"
        >

          <div className="mx-auto max-w-7xl px-6 py-24">

            {/* Section heading */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <div>

                <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                  Explore
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Projects worth supporting
                </h2>

                <p className="mt-3 max-w-xl text-gray-400">
                  Discover innovative ideas from creators around the world
                  and help bring them to life.
                </p>

              </div>


              <button className="flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-white">

                View all campaigns

                <ArrowUpRight size={16} />

              </button>

            </div>


            {/* Campaign cards */}
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {loading ? (
  <div className="col-span-full py-12 text-center text-gray-400">
    Loading campaigns from blockchain...
  </div>
) : campaigns.length === 0 ? (
  <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
    <p className="text-lg font-semibold text-white">
      No campaigns yet
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Be the first to create a campaign.
    </p>
  </div>
) : (
  campaigns.map((campaign) => (
    <CampaignCard
      key={campaign.id}
      {...campaign}
    />
  ))
)}

            </div>

          </div>

        </section>
        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="border-t border-white/10 bg-[#08090d]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">

            {/* Heading */}
            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Crowdfunding, reimagined
              </h2>

              <p className="mt-4 text-gray-400">
                A simple and transparent way to bring ideas to life using
                blockchain technology.
              </p>

            </div>


            {/* Steps */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">

              {/* Step 1 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-violet-500/30">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-violet-400">
                    01
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    ✦
                  </div>

                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  Create a Campaign
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Share your idea, set a funding goal, and give your project
                  a deadline.
                </p>

              </div>


              {/* Step 2 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-fuchsia-500/30">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-fuchsia-400">
                    02
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                    ◆
                  </div>

                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  Receive Support
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Backers can contribute ETH directly through a secure
                  blockchain transaction.
                </p>

              </div>


              {/* Step 3 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-pink-500/30">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-pink-400">
                    03
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                    ✓
                  </div>

                </div>

                <h3 className="mt-8 text-xl font-semibold">
                  Build the Future
                </h3>

                <p className="mt-3 leading-7 text-gray-400">
                  Track your campaign transparently and access funds when
                  your funding goal is reached.
                </p>

              </div>

            </div>

          </div>
        </section>
              {/* ================= CTA ================= */}
        <section
          id="about"
          className="border-t border-white/10 bg-[#0b0c11]"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">

            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent px-8 py-16 text-center md:px-16">

              {/* Glow */}
              <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

              <div className="relative">

                <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                  Start something meaningful
                </p>

                <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                  Your next big idea could start here.
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-gray-400">
                  Create a campaign, find supporters, and turn your idea
                  into something real.
                </p>

                <button className="mt-8 rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:scale-[1.02] hover:bg-gray-200">
                  Start a Campaign
                </button>

              </div>

            </div>

          </div>
        </section>
                {/* ================= FOOTER ================= */}
        <footer className="border-t border-white/10 bg-[#08090d]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles size={17} />
              </div>

              <span className="font-semibold">
                Fundora
              </span>

            </div>

            <p className="text-sm text-gray-500">
              Decentralized crowdfunding powered by Ethereum.
            </p>

            <p className="text-sm text-gray-600">
              © 2026 Fundora
            </p>

          </div>
        </footer>
      </main>

    </div>
  );
}



export default App;