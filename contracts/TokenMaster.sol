// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    // State Variables

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}
}
