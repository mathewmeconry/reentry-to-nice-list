import { expect } from "chai";
import { ethers } from "hardhat";

it("should have not started", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  const deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(0);
});

it("should not be nice", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  const isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(false);
});

it("should start", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  await santasList.connect(attacker).start();
  const deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(12);
  const isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(false);
});

it("should remove 1 deed", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  await santasList.connect(attacker).start();
  await santasList.connect(attacker).goodDeed();
  const deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(11);
});

it("should not remove 2 deed", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  await santasList.connect(attacker).start();
  await santasList.connect(attacker).goodDeed();
  expect(santasList.connect(attacker).goodDeed()).be.revertedWith("You have already done your good deed this month");
  const deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(11);
});

it("should have 0 deeds left and be nice", async function () {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  const AttackerContract = await ethers.getContractFactory(
    "Attacker",
    attacker
  );
  const attackerContract = await AttackerContract.deploy();

  await attackerContract.connect(attacker).setTarget(santasList.address);
  await attackerContract.connect(attacker).attack({ gasLimit: 30000000 });

  const deeds = await santasList.goodDeedsLeft(attacker.address);
  expect(deeds).to.equal(0);

  const isNice = await santasList.isNice(attacker.address);
  expect(isNice).to.equal(true);
});

it("should return false for isStarted", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  expect(await santasList.isStarted(attacker.address)).to.equal(false);
});

it("should return true for isStarted", async () => {
  const [deployer, attacker] = await ethers.getSigners();
  const SantasList = await ethers.getContractFactory("SantasList", deployer);
  const santasList = await SantasList.deploy();
  await santasList.connect(attacker).start()
  expect(await santasList.isStarted(attacker.address)).to.equal(true);
});
