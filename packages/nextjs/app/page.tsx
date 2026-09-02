"use client";

import launchTokenArtifact from "../../hardhat/artifacts/contracts/LaunchToken.sol/LaunchToken.json";
import type { NextPage } from "next";
import type { Hex } from "viem";
import { avalancheFuji } from "viem/chains";
import { useAccount, useDeployContract, useWaitForTransactionReceipt } from "wagmi";

const FUJI_EXPLORER = "https://testnet.snowtrace.io";

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data: hash, deployContract, error, isPending } = useDeployContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const deploy = () => {
    if (!address) return;

    deployContract({
      abi: launchTokenArtifact.abi,
      bytecode: launchTokenArtifact.bytecode as Hex,
      args: [address],
      chainId: avalancheFuji.id,
    });
  };

  return (
    <main className="flex grow items-center justify-center bg-base-200 px-4 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-base-300 bg-base-100 p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Avalanche Fuji</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Deploy AVLT</h1>
        <p className="mt-4 text-base-content/70">
          Connect a Fuji wallet to deploy the 100,000 AVLT LaunchToken. Confirmation and explorer links will appear here
          after the wallet submits the transaction.
        </p>

        <div className="mt-8 rounded-xl border border-base-300 bg-base-200 p-4">
          <p className="text-sm text-base-content/70">Connected wallet</p>
          <p className="mt-1 break-all font-mono text-sm font-semibold">{address ?? "Connect a wallet to continue."}</p>
        </div>

        <button
          className="btn btn-primary mt-6 w-full"
          disabled={isPending || isConfirming || !address}
          onClick={deploy}
          type="button"
        >
          {isPending ? "Confirm deployment in wallet" : isConfirming ? "Confirming deployment" : "Deploy AVLT to Fuji"}
        </button>

        {hash && (
          <p className="mt-6 break-all text-sm">
            Deployment transaction:{" "}
            <a className="link link-primary" href={`${FUJI_EXPLORER}/tx/${hash}`} rel="noreferrer" target="_blank">
              {hash}
            </a>
          </p>
        )}

        {receipt?.contractAddress && (
          <p className="mt-3 break-all text-sm text-success">
            Contract deployed:{" "}
            <a
              className="link link-success"
              href={`${FUJI_EXPLORER}/address/${receipt.contractAddress}`}
              rel="noreferrer"
              target="_blank"
            >
              {receipt.contractAddress}
            </a>
          </p>
        )}

        {error && <p className="mt-6 break-words text-sm text-error">{error.message}</p>}
      </section>
    </main>
  );
};

export default Home;
