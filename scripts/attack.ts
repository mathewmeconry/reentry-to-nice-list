import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const Attacker = await ethers.getContractFactory("Attacker");
  const attacker = await Attacker.deploy();

  console.log("attacker deployed to:", attacker.address);
  await attacker.setTarget("0x73D81979766A4076e73Da18786df983A80a86212")
  await attacker.attack({ gasLimit: 10000000 })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });