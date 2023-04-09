// SPDX-License-Identifier: MIT
// Deployed at https://mumbai.polygonscan.com/address/0xe6D466De66FBc2044f1FA320B67fAc3C3c8DF3e7
pragma solidity ^0.8.4;

contract PopCornCounter {
    int128 private pop = 0;
    int128 private corn = 0;

    function incrementPop() public {
        pop += 1;
    }

    function incrementCorn() public {
        corn += 1;
    }

    function getPopCorn() public view returns (int128, int128) {
        return (pop, corn);
    }
}