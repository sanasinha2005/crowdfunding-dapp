
import { ArrowUpRight, Clock, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract, getProvider } from "../blockchain/contract";



function CampaignCard({
  id,
  title,
  description,
  owner,
  target,
  amountCollected,
  deadline,
  withdrawn,
  image,
}) {
    const [showDetails, setShowDetails] = useState(false);
    const [userDonation, setUserDonation] = useState("0");
    const [status, setStatus] = useState("");
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");
    const [donating, setDonating] = useState(false);
    const targetEth = Number(ethers.formatEther(target));
  const raisedEth = Number(ethers.formatEther(amountCollected));
  const progress =
    targetEth > 0
      ? Math.min((raisedEth / targetEth) * 100, 100)
      : 0;

  const remainingTime =
    Number(deadline) * 1000 - Date.now();

  const daysLeft = Math.max(
    0,
    Math.ceil(remainingTime / (1000 * 60 * 60 * 24))
  );

  useEffect(() => {
  let interval;

  const loadUserDonation = async () => {
    try {
      if (!window.ethereum) return;

      const provider = getProvider();

      const accounts = await provider.send("eth_accounts", []);

      if (!accounts.length) {
        setUserDonation("0");
        return;
      }

      const contract = await getContract(false);

      const donation = await contract.getDonation(
        id,
        accounts[0]
      );

      setUserDonation(
        ethers.formatEther(donation)
      );

    } catch (error) {
      console.error("Failed to load user donation:", error);
    }
  };

  loadUserDonation();

  // Check the connected wallet every second
  interval = setInterval(loadUserDonation, 1000);

  return () => {
    clearInterval(interval);
  };
}, [id]);


const supportCampaign = async () => {
  try {
    if (!donationAmount || Number(donationAmount) <= 0) {
      setStatus("Please enter a valid donation amount.");
      return;
    }

    setDonating(true);
    setStatus("Waiting for MetaMask confirmation...");

    const contract = await getContract(true);

    const tx = await contract.donateToCampaign(id, {
      value: ethers.parseEther(donationAmount),
    });

    setStatus("Transaction processing...");


    await tx.wait();

    setStatus("Donation successful!");

    setDonationAmount("");
    setShowDonateModal(false);

    window.location.reload();

  } catch (error) {
    console.error("Donation failed:", error);

    if (error.code === "ACTION_REJECTED") {
      setStatus("Transaction cancelled in MetaMask.");
    } else {
      setStatus("Donation failed. Please try again.");
    }

  } finally {
    setDonating(false);
  }
};

const withdrawFunds = async () => {
  try {
    const contract = await getContract(true);

    const tx = await contract.withdrawFunds(id);


    await tx.wait();

    console.log("Funds withdrawn successfully!");

    alert("Funds withdrawn successfully!");

    window.location.reload();
  } catch (error) {
    console.error("Withdrawal failed:", error);
    alert("Withdrawal failed. Check the console.");
  }
};

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium backdrop-blur-md">
          Blockchain
        </span>

        <button
  onClick={() => setShowDetails(true)}
  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition hover:bg-white hover:text-black"
>
  <ArrowUpRight size={17} />
</button>

      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
          {description}
        </p>

        {/* Progress */}
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between text-sm">

            <span className="font-semibold text-white">
              {raisedEth} ETH
            </span>

            <span className="text-gray-500">
              of {targetEth} ETH
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
              style={{ width: `${progress}%` }}
            />

          </div>

          <div className="mt-2 text-right text-xs text-gray-500">
            {Math.round(progress)}% funded
          </div>

        </div>

{Number(userDonation) > 0 && (
  <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
    <div className="text-xs text-violet-300">
      Your contribution
    </div>

    <div className="mt-1 text-lg font-semibold text-white">
      {userDonation} ETH
    </div>
  </div>
)}

        {/* Stats */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-500">

          <div className="flex items-center gap-1.5">
            <Wallet size={14} />
            {owner.slice(0, 6)}...{owner.slice(-4)}
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {daysLeft} days left
          </div>

        </div>

{/* Button */}
{!withdrawn && progress >= 100 ? (
  <button
    onClick={withdrawFunds}
    className="mt-5 w-full rounded-xl bg-green-500 py-3 text-sm font-semibold text-black transition hover:bg-green-400"
  >
    Withdraw Funds
  </button>
) : withdrawn ? (
  <button
    disabled
    className="mt-5 w-full rounded-xl bg-white/5 py-3 text-sm font-semibold text-gray-500"
  >
    Funds Withdrawn
  </button>
) : (
  <button
  onClick={() => setShowDonateModal(true)}
  className="mt-5 w-full rounded-xl bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
>
  Support Campaign
</button>
)}

      </div>

{showDonateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111218] p-6 shadow-2xl">

      {/* Modal Header */}
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-xl font-semibold text-white">
            Support Campaign
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Support "{title}"
          </p>
        </div>

        <button
          onClick={() => setShowDonateModal(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

      </div>

      {/* Donation Input */}
      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Donation amount
        </label>

        <div className="relative">

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.01"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
            ETH
          </span>

        </div>

      </div>

{status && (
  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
    {status}
  </div>
)}

      {/* Donate Button */}
      <button
        onClick={supportCampaign}
        disabled={donating}
        className="mt-6 w-full rounded-xl bg-violet-500 py-3.5 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {donating ? "Processing..." : "Donate ETH"}
      </button>

    </div>

  </div>
)}

    {showDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111218] shadow-2xl">

      {/* Close */}
      <button
        onClick={() => setShowDetails(false)}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white hover:text-black"
      >
        <X size={18} />
      </button>

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-56 w-full object-cover"
      />

      {/* Details */}
      <div className="p-6">

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 leading-7 text-gray-400">
          {description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-gray-500">
              Raised
            </p>

            <p className="mt-1 font-semibold text-white">
              {raisedEth} ETH
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-gray-500">
              Goal
            </p>

            <p className="mt-1 font-semibold text-white">
              {targetEth} ETH
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-gray-500">
              Time Left
            </p>

            <p className="mt-1 font-semibold text-white">
              {daysLeft} days
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-gray-500">
              Creator
            </p>

            <p className="mt-1 font-semibold text-white">
              {owner.slice(0, 6)}...{owner.slice(-4)}
            </p>
          </div>

        </div>

        <button
          onClick={() => {
            setShowDetails(false);
            supportCampaign();
          }}
          className="mt-6 w-full rounded-xl bg-violet-500 py-3.5 font-semibold text-white transition hover:bg-violet-400"
        >
          Support Campaign
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default CampaignCard;