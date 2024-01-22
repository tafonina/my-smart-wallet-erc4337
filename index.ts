import { ethers } from "ethers";
import { Client, Presets } from "userop";
require("dotenv").config();

// Create a random private key or read existing one from environment variable
const privateKey = process.env.OWNER_PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
const bundlerRpcUrl = process.env.BUNDLER_RPC || "";

console.log(bundlerRpcUrl);
async function main() {
  // Create a wallet instance from the private key
  const owner = new ethers.Wallet(privateKey);

  // Entry point and factory addresses for Polygon Mumbai testnet
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";

  const smartAccount = await Presets.Builder.SimpleAccount.init(owner, bundlerRpcUrl, {
    entryPoint: entryPointAddress,
    factory: factoryAddress,
  });
  console.log("smart wallet address", smartAccount.getSender());

  const client = await Client.init(bundlerRpcUrl, {
    entryPoint: entryPointAddress,
  });

  const result = await client.sendUserOperation(
    // calling setX(uint) method of 0x428Df753DEdffD0330c1a18bFe8262c6146d2614 smart contract with parameter 6
    smartAccount.execute("0x428Df753DEdffD0330c1a18bFe8262c6146d2614", 0, "0x4018d9aa0000000000000000000000000000000000000000000000000000000000000006")
  );

  const event = await result.wait();
  console.log(`Transaction hash: ${event?.transactionHash}`);
}

main().catch(console.error);
