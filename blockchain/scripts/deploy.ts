import { network } from "hardhat";

const { ethers } = await network.connect();

console.log("Deploying Crowdfunding contract...");

const crowdfunding =
  await ethers.deployContract("Crowdfunding");

await crowdfunding.waitForDeployment();

console.log(
  "Crowdfunding deployed to:",
  await crowdfunding.getAddress()
);