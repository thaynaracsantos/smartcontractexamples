// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Condominium {
    address public condominiumManager;
    string public condominiumName;
    uint256 public condominiumDefaultFee;

    bool locked = false;

    constructor() {
        condominiumManager = msg.sender;
    }

    function setCondominiumName(string memory _name) external {
        require(
            msg.sender == condominiumManager,
            "You must be the manager to set the name of the condominium."
        );
        condominiumName = _name;
    }

    function setCondominiumDefaultFee(uint256 _defaultFee) external {
        require(
            msg.sender == condominiumManager,
            "You must be the manager to set the default fee of the condominium."
        );
        condominiumDefaultFee = _defaultFee;
    }

    function getCondominiumBalance() public view returns (uint256) {
        require(
            msg.sender == condominiumManager,
            "You must be the manager of the condominium to see all balances."
        );
        return address(this).balance;
    }

    function payCondominiumFee() public payable {
        require(!locked, "Reentrant call detected!");
        locked = true;

        (bool success, ) = msg.sender.call{value: msg.value}("");
        require(success, "Transfer failed."); 

        locked = false;  
    }

}
