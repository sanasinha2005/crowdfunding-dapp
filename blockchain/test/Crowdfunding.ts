import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Crowdfunding", function () {

  async function deployCrowdfunding() {
    const crowdfunding =
      await ethers.deployContract("Crowdfunding");

    await crowdfunding.waitForDeployment();

    return crowdfunding;
  }


  // =========================================
  // Test 1 — Deployment
  // =========================================

  it("should deploy successfully", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    expect(
      await crowdfunding.campaignCount()
    ).to.equal(0);
  });


  // =========================================
  // Test 2 — Create Campaign
  // =========================================

  it("should create a campaign", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    await crowdfunding.createCampaign(
      "EcoBottle",
      "A sustainable reusable bottle",
      ethers.parseEther("5"),
      30
    );

    const campaign =
      await crowdfunding.getCampaign(0);

    expect(campaign.title)
      .to.equal("EcoBottle");

    expect(campaign.target)
      .to.equal(ethers.parseEther("5"));

    expect(campaign.amountCollected)
      .to.equal(0);

    expect(campaign.withdrawn)
      .to.equal(false);
  });


  // =========================================
  // Test 3 — Donation
  // =========================================

  it("should accept donations", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    await crowdfunding.createCampaign(
      "StudySphere",
      "A collaborative learning platform",
      ethers.parseEther("5"),
      30
    );

    await crowdfunding.donateToCampaign(0, {
      value: ethers.parseEther("1")
    });

    const campaign =
      await crowdfunding.getCampaign(0);

    expect(campaign.amountCollected)
      .to.equal(ethers.parseEther("1"));
  });


  // =========================================
  // Test 4 — Track Donor
  // =========================================

  it("should track donor contributions", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    const [owner, donor] =
      await ethers.getSigners();

    await crowdfunding.createCampaign(
      "SolarHome",
      "Affordable solar energy",
      ethers.parseEther("5"),
      30
    );

    await crowdfunding
      .connect(donor)
      .donateToCampaign(0, {
        value: ethers.parseEther("2")
      });

    const donation =
      await crowdfunding.getDonation(
        0,
        donor.address
      );

    expect(donation)
      .to.equal(ethers.parseEther("2"));
  });


  // =========================================
  // Test 5 — Cannot Donate Zero
  // =========================================

  it("should reject zero donations", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    await crowdfunding.createCampaign(
      "Test Campaign",
      "Testing zero donation",
      ethers.parseEther("1"),
      30
    );

    await expect(
      crowdfunding.donateToCampaign(0, {
        value: 0
      })
    ).to.be.revertedWith(
      "Donation must be greater than zero"
    );
  });


  // =========================================
  // Test 6 — Withdraw Funds
  // =========================================

  it("should allow owner to withdraw after reaching target", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    const [owner] =
      await ethers.getSigners();

    await crowdfunding.createCampaign(
      "SolarHome",
      "Solar energy project",
      ethers.parseEther("2"),
      30
    );

    await crowdfunding.donateToCampaign(0, {
      value: ethers.parseEther("2")
    });

    const balanceBefore =
      await ethers.provider.getBalance(
        owner.address
      );

    const transaction =
      await crowdfunding.withdrawFunds(0);

    const receipt =
      await transaction.wait();

    const balanceAfter =
      await ethers.provider.getBalance(
        owner.address
      );

    expect(
      balanceAfter
    ).to.be.gt(balanceBefore);

    const campaign =
      await crowdfunding.getCampaign(0);

    expect(campaign.withdrawn)
      .to.equal(true);
  });


  // =========================================
  // Test 7 — Cannot Withdraw Early
  // =========================================

  it("should prevent withdrawal before target is reached", async function () {

    const crowdfunding =
      await deployCrowdfunding();

    await crowdfunding.createCampaign(
      "Incomplete Project",
      "Testing withdrawal protection",
      ethers.parseEther("5"),
      30
    );

    await crowdfunding.donateToCampaign(0, {
      value: ethers.parseEther("1")
    });

    await expect(
      crowdfunding.withdrawFunds(0)
    ).to.be.revertedWith(
      "Funding target not reached"
    );
  });

});