import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const ONE = 10n ** 18n;

describe("DexPricedLaunchToken", () => {
  it("quotes and sells tokens using the pair's live reserve price", async () => {
    const [holder, buyer] = await ethers.getSigners();
    const payment = await ethers.deployContract("MockERC20", ["Test USDC", "tUSDC"]);
    const quote = await ethers.deployContract("MockERC20", ["Wrapped AVAX", "WAVAX"]);
    const pair = await ethers.deployContract("MockUniswapV2Pair", [
      await payment.getAddress(),
      await quote.getAddress(),
    ]);
    await pair.setReserves(100n * ONE, 200n * ONE);

    const token = await ethers.deployContract("DexPricedLaunchToken", [
      holder.address,
      await payment.getAddress(),
      await quote.getAddress(),
      await pair.getAddress(),
    ]);

    await payment.mint(buyer.address, 10n * ONE);
    await token.approve(await token.getAddress(), 20n * ONE);
    await payment.connect(buyer).approve(await token.getAddress(), 10n * ONE);

    expect(await token.quoteTokenOut(10n * ONE)).to.equal(20n * ONE);
    await expect(token.connect(buyer).buy(10n * ONE, 20n * ONE))
      .to.emit(token, "Purchased")
      .withArgs(buyer.address, 10n * ONE, 20n * ONE);

    expect(await token.balanceOf(buyer.address)).to.equal(20n * ONE);
    expect(await payment.balanceOf(holder.address)).to.equal(10n * ONE);
  });

  it("rejects a zero-liquidity pair", async () => {
    const [holder] = await ethers.getSigners();
    const payment = await ethers.deployContract("MockERC20", ["Test USDC", "tUSDC"]);
    const quote = await ethers.deployContract("MockERC20", ["Wrapped AVAX", "WAVAX"]);
    const pair = await ethers.deployContract("MockUniswapV2Pair", [
      await payment.getAddress(),
      await quote.getAddress(),
    ]);
    const token = await ethers.deployContract("DexPricedLaunchToken", [
      holder.address,
      await payment.getAddress(),
      await quote.getAddress(),
      await pair.getAddress(),
    ]);

    await expect(token.quoteTokenOut(ONE)).to.be.revertedWithCustomError(token, "EmptyLiquidity");
  });
});
