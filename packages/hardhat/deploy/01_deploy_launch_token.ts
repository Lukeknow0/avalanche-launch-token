import { artifacts, deployScript } from "../rocketh/deploy.js";

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;
    await env.deploy("LaunchToken", {
      account: deployer,
      artifact: artifacts.LaunchToken,
      args: [deployer],
    });
  },
  { tags: ["LaunchToken"] },
);
