// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    // State Variables
    address immutable public i_owner;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        i_owner = msg.sender;
    }

    function getOwner() public view returns (address owner) {
        owner = i_owner;
    }
}
