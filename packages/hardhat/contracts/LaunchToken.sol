// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LaunchToken is ERC20 {
    constructor(address initialHolder) ERC20("Avalanche Launch Token", "AVLT") {
        _mint(initialHolder, 100_000 ether);
    }
}
