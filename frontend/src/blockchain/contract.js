import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./config";

import contractData from "../../../blockchain/artifacts/contracts/Crowdfunding.sol/Crowdfunding.json";

export const CONTRACT_ABI = contractData.abi;


// ==========================================
// Get Browser Provider
// ==========================================

export function getProvider() {
  if (!window.ethereum) {
    throw new Error(
      "MetaMask is not installed. Please install MetaMask."
    );
  }

  return new ethers.BrowserProvider(window.ethereum);
}


// ==========================================
// Get Connected Signer
// ==========================================

export async function getSigner() {
  const provider = getProvider();

  await provider.send(
    "eth_requestAccounts",
    []
  );

  return await provider.getSigner();
}


// ==========================================
// Get Contract
// ==========================================

export async function getContract(
  withSigner = false
) {

  if (withSigner) {

    const signer = await getSigner();

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

  }

  const provider = getProvider();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );
}