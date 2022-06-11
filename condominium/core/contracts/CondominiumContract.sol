// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Condominium {
    address public condominiumManager;
    string public condominiumName;
    uint256 public condominiumDefaultFee;
    mapping(address => string) public withdrawHistory;

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

    function payCondominiumBill(address payable _to, uint256 _total, string memory _reason) public {
        require(!locked, "Reentrant call detected!");
        locked = true;

        require(
            msg.sender == condominiumManager,
            "You must be the manager of the condominium to withdraw."
        );

        require(_total <= getCondominiumBalance(), "You have insuffient funds to do the payment.");
        
        withdrawHistory[_to] = string(abi.encodePacked("Reason: ", _reason, ". Total: ", _total));

        (bool success, ) = _to.call{value: _total}("");
        require(success, "Transfer failed."); 

        locked = false;       
    }

    function payCondominiumFee(uint256 _condominiumFee) public payable {
        require(!locked, "Reentrant call detected!");
        locked = true;

        require(_condominiumFee == condominiumDefaultFee, string(abi.encodePacked("The amount need to be equal to ", condominiumDefaultFee)));

        (bool success, ) = condominiumManager.call{value: _condominiumFee}("");
        require(success, "Transfer failed."); 

        locked = false;  
    }

}
