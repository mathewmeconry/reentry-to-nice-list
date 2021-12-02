import { expect } from "chai";
import { ethers, network } from "hardhat";

it("should pass", async () => {
  const [deployer, attacker] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);
  console.log("Attacker:", attacker.address);

  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();

  console.log("SantasList:", santasList.address);

  const AttackerContract = await ethers.getContractFactory(
    "Attacker",
    attacker
  );
  const attackerContract = await AttackerContract.deploy();

  console.log("AttackerContract:", attackerContract.address);

  let deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(0);

  let isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(false);

  await santasList.connect(attacker).start();
  deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(12);

  isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(false);

  await santasList.connect(attacker).goodDeed();
  deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(11);

  await attackerContract.connect(attacker).setTarget(santasList.address);
  await attackerContract.connect(attacker).attack({ gasLimit: 30000000 });

  deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(0);

  isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(true);
});
