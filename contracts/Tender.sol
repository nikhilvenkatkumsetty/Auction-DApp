pragma solidity >=0.4.21 <0.8.0;
pragma experimental ABIEncoderV2;

contract TenderAuction {
    uint public tenderCount = 0;
    uint public bidCount = 0;
    uint public uploaderCount = 0;
    uint public bidderCount = 0;
    uint public bidWinCount = 0;

    struct Uploader {
        uint id;
        string username;
    }

    struct Bidder {
        uint id;
        string username;
    }

    struct Bid {
        uint id;
        uint tenderId;
        string tenderTitle;
        uint bid;
        address userHash;
        address tenderIssuer; /*here*/
    }

    struct Tender {
        uint id;
        string itemName;
        string itemDescription;
        uint quantity;
        address userHash;
    }

    mapping (uint => Tender) public tenders;
    mapping (uint => Bid) public bids;
    mapping (uint => address) public whoIsUploader;
    mapping (uint => address) public whoIsBidder;
    mapping (address => Uploader) public uploaders;
    mapping (address => Bidder) public bidders;
    mapping (uint => Bid) public bidWins;
    // modifier isUploader(address _userHash) {
    //     require(uploaders[_userHash]);
    //     _;
    // }

    // modifier isBidder(address _userHash) {
    //     require(bidders[_userHash]);
    //     _;
    // }

    modifier alreadyPresent(address _address) {
        for(uint i = 1; i <= uploaderCount; i++) {
            if(whoIsUploader[i] == _address) {
                require(1 == 2, "Address already present");
            }
        }

        for(uint i = 1; i <= bidderCount; i++) {
            if(whoIsBidder[i] == _address) {
                require(1 == 2, "Address already present");
            }
        }
        _;
    }

    function createUploader(string memory _username) public alreadyPresent(msg.sender) {
        uploaderCount++;
        whoIsUploader[uploaderCount] = msg.sender;
        uploaders[msg.sender] = Uploader(uploaderCount, _username);
    }

    function createBidder(string memory _username) public alreadyPresent(msg.sender) {
        bidderCount++;
        whoIsBidder[bidderCount] = msg.sender;
        bidders[msg.sender] = Bidder(bidderCount, _username);
    }

    function createTender(string memory _itemName, string memory _itemDescription, uint _quantity) public {
        tenderCount++;
        tenders[tenderCount] = Tender(tenderCount, _itemName, _itemDescription, _quantity, msg.sender); /*here*/
    }

    function createBid(uint _tenderId, uint _bid) public {
        bidCount++;
        string memory tenderName = tenders[_tenderId].itemName;
        address tenderIssuer = tenders[_tenderId].userHash;
        bids[bidCount] = Bid(bidCount, _tenderId, tenderName, _bid, msg.sender, tenderIssuer); /*here*/
    }
    //uint _BId,uint _TId,string memory _TTitle,uint _BidAmount,address _UHash,address _TIssuer
    function addBidWin(uint _BId,uint _TId,string memory _TTitle,uint _BidAmount,address _UHash,address _TIssuer) public {
        bidWinCount++;
        bidWins[bidWinCount] = Bid(_BId,_TId,_TTitle,_BidAmount,_UHash,_TIssuer);
    }
}
