pragma solidity 0.8.0;

contract SantasList {
    mapping(address => uint256) nextGoodDeedAfter;
    mapping(address => uint256) naughtyList;

    function start() public {
        nextGoodDeedAfter[tx.origin] = 0;
        naughtyList[tx.origin] = 12;
    }

    function goodDeed() public {
        require(
            nextGoodDeedAfter[tx.origin] < block.number,
            "You have already done your good deed this month!"
        );
        if (naughtyList[tx.origin] > 0) {
            naughtyList[tx.origin] = naughtyList[tx.origin] - 1;
            (bool success, ) = msg.sender.call("");
            require(success, "Call failed");
            nextGoodDeedAfter[tx.origin] = block.number + 172800;
        }
    }
    
    function isNice(address _address) public view returns (bool) {
        if(nextGoodDeedAfter[_address] > 0 && naughtyList[_address] == 0) {
            return true;
        } else {
            return false;
        }
    }

    function goodDeedsLeft(address _address) public view returns (uint256) {
        return naughtyList[_address];
    }


    function isStarted(address _address) public view returns (bool) {
       return naughtyList[_address] > 0 || nextGoodDeedAfter[_address] > 0;
    }
}
