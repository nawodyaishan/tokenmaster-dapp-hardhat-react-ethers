// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenMaster is ERC721, Ownable {
    uint256 public s_totalEvents;
    uint256 public s_totalSupply;

    mapping(uint => Event) public m_events;
    mapping(uint => mapping(uint256 => address)) public m_seats;
    mapping(uint => uint256[]) public m_takenSeats;
    mapping(uint256 => mapping(address => bool))
    public m_hasPurchasedEventTicket;

    struct Event {
        uint256 id;
        string name;
        uint256 cost;
        uint256 maxTickets;
        uint256 tickets;
        string date;
        string time;
        string location;
    }

    error EventDoesNotExist();
    error InvalidSeatNumber();
    error SeatAlreadyTaken();
    error MustBeTheOwner();

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {}

    function setEvent(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        s_totalEvents++;
        m_events[s_totalEvents] = Event(
            s_totalEvents,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function mint(uint256 _eventId, uint _seat) public payable {
        if (_eventId > s_totalEvents) revert EventDoesNotExist();
        if (_seat == 0 || _seat > m_events[_eventId].maxTickets)
            revert InvalidSeatNumber();
        if (m_seats[_eventId][_seat] != address(0)) revert SeatAlreadyTaken();

        // Updating event ticket count
        m_events[_eventId].tickets -= 1;
        // Update event buying status
        m_hasPurchasedEventTicket[_eventId][msg.sender] = true;
        // Updating seats
        m_seats[_eventId][_seat] = msg.sender;
        // Updating seat availability
        m_takenSeats[_eventId].push(_seat);
        // Increment total NFT Count
        s_totalSupply++;
        // Proceed with minting
        _safeMint(msg.sender, s_totalSupply);
    }

    function withdraw() public onlyOwner {
        (bool success,) = owner().call{value: address(this).balance}("");
        if (!success) revert MustBeTheOwner();
    }

    function getEventFromId(
        uint256 _id
    ) public view returns (Event memory _event) {
        _event = m_events[_id];
    }

    function getSeatsTakenFromId(
        uint256 _eventId
    ) public view returns (uint256[] memory takenSeats) {
        takenSeats = m_takenSeats[_eventId];
    }
}
