// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

/// @notice A fixed-supply AVLT token whose purchase amount is quoted from a live DEX pair.
/// @dev The initial holder must approve this contract before buyers can receive inventory.
contract DexPricedLaunchToken is ERC20 {
    address public immutable initialHolder;
    IERC20 public immutable paymentToken;
    address public immutable quoteToken;
    IUniswapV2Pair public immutable dexPair;

    event Purchased(address indexed buyer, uint256 paymentIn, uint256 tokenOut);

    error InvalidPair();
    error InvalidAmount();
    error EmptyLiquidity();

    constructor(address initialHolder_, address paymentToken_, address quoteToken_, address dexPair_)
        ERC20("DEX Priced Avalanche Launch Token", "dpAVLT")
    {
        initialHolder = initialHolder_;
        paymentToken = IERC20(paymentToken_);
        quoteToken = quoteToken_;
        dexPair = IUniswapV2Pair(dexPair_);

        address token0 = dexPair.token0();
        address token1 = dexPair.token1();
        if (
            initialHolder_ == address(0) || paymentToken_ == address(0) || quoteToken_ == address(0) || dexPair_ == address(0)
                || !((token0 == paymentToken_ && token1 == quoteToken_) || (token1 == paymentToken_ && token0 == quoteToken_))
        ) {
            revert InvalidPair();
        }

        _mint(initialHolder_, 100_000 ether);
    }

    /// @notice Quotes dpAVLT output from the live payment-token/quote-token DEX pair.
    /// @dev Both Task 3 Fuji assets should use 18 decimals; different decimal configurations require normalization.
    function quoteTokenOut(uint256 paymentIn) public view returns (uint256 tokenOut) {
        if (paymentIn == 0) revert InvalidAmount();

        (uint112 reserve0, uint112 reserve1,) = dexPair.getReserves();
        (uint256 paymentReserve, uint256 quoteReserve) = dexPair.token0() == address(paymentToken)
            ? (uint256(reserve0), uint256(reserve1))
            : (uint256(reserve1), uint256(reserve0));
        if (paymentReserve == 0 || quoteReserve == 0) revert EmptyLiquidity();

        return (paymentIn * quoteReserve) / paymentReserve;
    }

    /// @notice Sells dpAVLT inventory at the current DEX-derived quote.
    function buy(uint256 paymentIn, uint256 minTokenOut) external returns (uint256 tokenOut) {
        tokenOut = quoteTokenOut(paymentIn);
        if (tokenOut < minTokenOut || tokenOut == 0) revert InvalidAmount();

        require(paymentToken.transferFrom(msg.sender, initialHolder, paymentIn), "payment transfer failed");
        _spendAllowance(initialHolder, address(this), tokenOut);
        _transfer(initialHolder, msg.sender, tokenOut);

        emit Purchased(msg.sender, paymentIn, tokenOut);
    }
}
