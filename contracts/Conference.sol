pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Conference {
    address public _conferenceOwner;
    bool public _openForRegistration;
    uint256 public _ticketPrice;
    uint256 public _speakerRewardFactor;
    uint256 public _numberOfSpeakers;
    uint256 public _amountSoldFor;

    mapping(address => bool) internal _attendees;
    mapping(address => bool) internal _speakers;

    mapping(address => bool) _hasClaimedReward;

    mapping(address => bool) _authProviders;
    mapping(address => bool) _auth;

    mapping(address => uint256) internal _speakerRating;

    modifier onlyOwner() {
        require(
            msg.sender == _conferenceOwner,
            "Only conference owner is allowed to do this"
        );
        _;
    }

    modifier onlySpeaker() {
        require(_speakers[msg.sender] == true, "Not a speaker");
        _;
    }

    modifier isAuthed() {
        require(_auth[msg.sender] == true, "Not authed");
        _;
    }

    modifier onlyAuthProviderOrOwner() {
        require(
            _authProviders[msg.sender] == true ||
                _conferenceOwner == msg.sender,
            "Not an authProvider or owner"
        );
        _;
    }

    modifier isClosed() {
        require(
            _openForRegistration == false,
            "Conference is not closed for registration"
        );
        _;
    }

    modifier isOpen() {
        require(
            _openForRegistration == true,
            "Conference is closed for registration"
        );
        _;
    }

    event NewTalk(address speaker, string name, uint256 talkId);
    event NewSpeaker(address speaker);
    event TicketSold(address attendee);
    event RewardToSpeakerPaid(address speaker, uint256 amount);
    event RewardToOwnerPaid(address owner, uint256 amount);

    constructor(
        uint256 ticketPrice,
        address[] memory authProviders,
        uint256 speakerRewardFactor
    ) {
        _ticketPrice = ticketPrice * 1 ether;
        _conferenceOwner = msg.sender;
        _setAuthProviders(authProviders);
        _speakerRewardFactor = speakerRewardFactor;
        _openForRegistration = true;
    }

    function _setAuthProviders(address[] memory authProviders) internal {
        for (uint256 i = 0; i < authProviders.length; i++) {
            _authProviders[authProviders[i]] = true;
        }
    }

    function isAuthProvider() public view returns (bool) {
        return _authProviders[msg.sender];
    }

    function auth(address participant) public onlyAuthProviderOrOwner {
        _auth[participant] = true;
    }

    function isAuthenticated() public view returns (bool) {
        return _auth[msg.sender];
    }

    function isOwner() public view returns (bool) {
        return msg.sender == _conferenceOwner;
    }

    function buyTicket() public payable isOpen isAuthed {
        require(_attendees[msg.sender] == false, "You already have a ticket");
        require(msg.value == _ticketPrice, "Please pay ticketprice");
        _attendees[msg.sender] = true;
        _amountSoldFor += msg.value;
    }

    function giveTicket(address reciever) public isOpen onlyOwner {
        require(_attendees[reciever] == false, "receiver already has a ticket");
        if (!_auth[reciever]) {
            auth(reciever);
        }
        _attendees[reciever] = true;
    }

    function hasTicket() public view returns (bool) {
        return _attendees[msg.sender];
    }

    function isSpeaker() public view returns (bool) {
        return _speakers[msg.sender];
    }

    function price() public view returns (uint256) {
        return _ticketPrice;
    }

    function registerAsSpeaker() public isOpen isAuthed {
        _speakers[msg.sender] = true;
        _numberOfSpeakers++;
        emit NewSpeaker(msg.sender);
    }

    function closeRegistration() public isOpen onlyOwner {
        _openForRegistration = false;
    }

    function checkEligbleRewardAmount() public view returns (uint256) {
        if (_hasClaimedReward[msg.sender] == true || _amountSoldFor == 0) {
            return 0;
        }
        if (msg.sender == _conferenceOwner) {
            return _amountSoldFor - (_amountSoldFor / _speakerRewardFactor);
        } else if (_speakers[msg.sender] == true) {
            return (_amountSoldFor / _speakerRewardFactor) / _numberOfSpeakers;
        } else {
            return 0;
        }
    }

    function claimSpeakerReward() public isClosed onlySpeaker {
        require(
            !_hasClaimedReward[msg.sender],
            "You have already claimed your reward"
        );
        // half of income to owner and half to speakers
        uint256 amountEligbleForReward = (_amountSoldFor /
            _speakerRewardFactor) / _numberOfSpeakers;
        _hasClaimedReward[msg.sender] = true;

        (bool sent, bytes memory data) = msg.sender.call{
            value: amountEligbleForReward
        }("");
        require(sent, "Failed to claim Ether");
        _hasClaimedReward[msg.sender] = true;
    }

    function claimOwnerReward() public isClosed onlyOwner {
        require(
            !_hasClaimedReward[msg.sender],
            "You have already claimed your reward"
        );
        uint256 amountEligable = _amountSoldFor -
            (_amountSoldFor / _speakerRewardFactor);
        (bool sent, bytes memory data) = msg.sender.call{value: amountEligable}(
            ""
        );
        require(sent, "Failed to claim Ether");
        _hasClaimedReward[msg.sender] = true;
    }
}
