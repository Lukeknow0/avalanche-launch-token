import { expect } from "chai";
import { network } from "hardhat";
import type { Abi_LaunchToken } from "../generated/abis/LaunchToken.js";
import { loadAndExecuteDeploymentsFromFiles } from "../rocketh/environment.js";

const { provider, networkHelpers, ethers } = await network.create();

async function deployFixture() {
  const env = await loadAndExecuteDeploymentsFromFiles({ provider });
  const { address, abi } = env.get<Abi_LaunchToken>("LaunchToken");
  return ethers.getContractAt(abi, address);
}

describe("LaunchToken", () => {
  it("mints the supply to the holder", async () => {
    const token = await networkHelpers.loadFixture(deployFixture);
    const [holder] = await ethers.getSigners();
    const expectedSupply = 100_000n * 10n ** 18n;
    expect(await token.name()).to.equal("Avalanche Launch Token");
    expect(await token.symbol()).to.equal("AVLT");
    expect(await token.totalSupply()).to.equal(expectedSupply);
    expect(await token.balanceOf(holder.address)).to.equal(expectedSupply);
  });

  it("transfers tokens", async () => {
    const token = await networkHelpers.loadFixture(deployFixture);
    const [, recipient] = await ethers.getSigners();
    await token.transfer(recipient.address, 25n * 10n ** 18n);
    expect(await token.balanceOf(recipient.address)).to.equal(25n * 10n ** 18n);
  });
});
