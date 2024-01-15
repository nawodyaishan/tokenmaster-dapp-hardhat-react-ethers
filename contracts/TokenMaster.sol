// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public immutable i_owner;
    uint256 public s_totalEvents;

    mapping(uint => Event) public m_events;

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

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        i_owner = msg.sender;
    }

    function getOwner() public view returns (address owner) {
        owner = i_owner;
    }

    function setEvent(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public {
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

    function getEventFromId(uint256 _id) public view returns (Event memory _event) {
        _event = m_events[_id];
    }
}
