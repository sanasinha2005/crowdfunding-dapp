// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Crowdfunding {

    // =========================
    // Campaign Structure
    // =========================

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        bool withdrawn;
    }

    // Campaign ID => Campaign
    mapping(uint256 => Campaign) public campaigns;

    // Campaign ID => Donor => Amount donated
    mapping(uint256 => mapping(address => uint256)) public donations;

    // Number of campaigns
    uint256 public campaignCount;


    // =========================
    // Events
    // =========================

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        string title,
        uint256 target,
        uint256 deadline
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );


    // =========================
    // Create Campaign
    // =========================

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _durationInDays
    ) public {

        require(
            _target > 0,
            "Target must be greater than zero"
        );

        require(
            _durationInDays > 0,
            "Duration must be greater than zero"
        );

        uint256 deadline = block.timestamp +
            (_durationInDays * 1 days);

        campaigns[campaignCount] = Campaign({
            owner: msg.sender,
            title: _title,
            description: _description,
            target: _target,
            deadline: deadline,
            amountCollected: 0,
            withdrawn: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _target,
            deadline
        );

        campaignCount++;
    }


    // =========================
    // Donate
    // =========================

    function donateToCampaign(
        uint256 _campaignId
    ) public payable {

        Campaign storage campaign =
            campaigns[_campaignId];

        require(
            _campaignId < campaignCount,
            "Campaign does not exist"
        );

        require(
            block.timestamp < campaign.deadline,
            "Campaign has ended"
        );

        require(
            msg.value > 0,
            "Donation must be greater than zero"
        );

        campaign.amountCollected += msg.value;

        donations[_campaignId][msg.sender] += msg.value;

        emit DonationReceived(
            _campaignId,
            msg.sender,
            msg.value
        );
    }


    // =========================
    // Withdraw Funds
    // =========================

    function withdrawFunds(
        uint256 _campaignId
    ) public {

        Campaign storage campaign =
            campaigns[_campaignId];

        require(
            msg.sender == campaign.owner,
            "Only campaign owner can withdraw"
        );

        require(
            campaign.amountCollected >= campaign.target,
            "Funding target not reached"
        );

        require(
            !campaign.withdrawn,
            "Funds already withdrawn"
        );

        uint256 amount =
            campaign.amountCollected;

        campaign.withdrawn = true;

        payable(campaign.owner).transfer(amount);

        emit FundsWithdrawn(
            _campaignId,
            campaign.owner,
            amount
        );
    }


    // =========================
    // Get Campaign
    // =========================

    function getCampaign(
        uint256 _campaignId
    )
        public
        view
        returns (Campaign memory)
    {
        require(
            _campaignId < campaignCount,
            "Campaign does not exist"
        );

        return campaigns[_campaignId];
    }


    // =========================
    // Get All Campaigns
    // =========================

    function getAllCampaigns()
        public
        view
        returns (Campaign[] memory)
    {
        Campaign[] memory allCampaigns =
            new Campaign[](campaignCount);

        for (
            uint256 i = 0;
            i < campaignCount;
            i++
        ) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }


    // =========================
    // Get Donation
    // =========================

    function getDonation(
        uint256 _campaignId,
        address _donor
    )
        public
        view
        returns (uint256)
    {
        return donations[_campaignId][_donor];
    }
}