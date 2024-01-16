// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing OpenZeppelin's ERC721 and Ownable contracts for NFT functionality and ownership management.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenMaster
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation with ownership features.
 */
contract TokenMaster is ERC721, Ownable {
    // State variables
    uint256 public s_totalEvents;
    uint256 public s_totalSupply;

    // Mapping from event ID to Event struct.
    mapping(uint => Event) public m_events;
    // Nested mapping to track which address owns which seat for each event.
    mapping(uint => mapping(uint256 => address)) public m_seats;
    // Mapping from event ID to an array of taken seat numbers.
    mapping(uint => uint256[]) public m_takenSeats;
    // Mapping to track if an address has purchased a ticket for an event.
    mapping(uint256 => mapping(address => bool))
    public m_hasPurchasedEventTicket;

    // Event struct representing an event's details.
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

    // Custom errors for revert conditions.
    error EventDoesNotExist();
    error InvalidSeatNumber();
    error SeatAlreadyTaken();
    error MustBeTheOwner();

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {}

    /**
     * @dev Creates a new event with the provided details.
     * @param _name Name of the event.
     * @param _cost Cost of the ticket for the event.
     * @param _maxTickets Maximum number of tickets available for the event.
     * @param _date Date of the event.
     * @param _time Time of the event.
     * @param _location Location of the event.
     * Requirements:
     * - Only the owner can call this function.
     */ function setEvent(
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

    /**
     * @dev Mints a ticket for the specified event and seat.
     * @param _eventId The event ID for which to mint the ticket.
     * @param _seat The seat number for the ticket.
     * Requirements:
     * - `_eventId` must refer to a valid event.
     * - `_seat` must be a valid seat number that has not already been taken.
     */ function mint(uint256 _eventId, uint _seat) public payable {
        if (_eventId > s_totalEvents) revert EventDoesNotExist();
        if (_seat == 0 || _seat > m_events[_eventId].maxTickets)
            revert InvalidSeatNumber();
        if (m_seats[_eventId][_seat] != address(0)) revert SeatAlreadyTaken();

        m_events[_eventId].tickets -= 1;
        m_hasPurchasedEventTicket[_eventId][msg.sender] = true;
        m_seats[_eventId][_seat] = msg.sender;
        m_takenSeats[_eventId].push(_seat);

        s_totalSupply++;
        _safeMint(msg.sender, s_totalSupply);
    }

    /**
     * @dev Withdraws all Ether from the contract to the owner's address.
     * Requirements:
     * - Only the owner can call this function.
     */ function withdraw() public onlyOwner {
    (bool success,) = owner().call{value: address(this).balance}("");
        if (!success) revert MustBeTheOwner();
    }

    /**
     * @dev Retrieves the details of an event by its ID.
     * @param _id The ID of the event to retrieve.
     * @return _event The event details.
     */ function getEventFromId(
        uint256 _id
    ) public view returns (Event memory _event) {
        _event = m_events[_id];
    }

    /**
     * @dev Retrieves the list of taken seats for an event.
     * @param _eventId The ID of the event.
     * @return takenSeats Array of seat numbers that have been taken for the event.
     */ function getSeatsTakenFromId(
        uint256 _eventId
    ) public view returns (uint256[] memory takenSeats) {
        takenSeats = m_takenSeats[_eventId];
    }
}
