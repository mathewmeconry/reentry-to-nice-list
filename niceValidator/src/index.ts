import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { ethers } from "ethers";
import crypto from "crypto";
import bodyParser from "body-parser";

const addressToUUID: { [index: string]: string } = {};

async function main() {
  if (!process.env.CONTRACT_ADDRESS || !process.env.FLAG) {
    console.error("Please set CONTRACT_ADDRESS and FLAG in .env");
    return;
  }

  const app = express();

  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, "../public/")));

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/randomMessage", getRandomMessage);
  app.post("/getFlag", getFlag);

  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
  });
}

async function getRandomMessage(req: express.Request, res: express.Response) {
  if (!req.query.address) {
    res.send("Address is required");
  }

  const uuid = crypto.randomUUID();
  addressToUUID[req.query.address as string] = uuid;
  res.send(uuid);
}

async function getFlag(req: express.Request, res: express.Response) {
  if (req.body.address && req.body.signature) {
    const message = addressToUUID[req.body.address];

    const verifiedAccount = ethers.utils.verifyMessage(
      message,
      req.body.signature
    );
    if (verifiedAccount.toLowerCase() == req.body.address.toLowerCase()) {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.eth.aragon.network/"
      );
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS || "",
        ["function isNice(address _address) public view returns (bool)"],
        provider.getSigner(verifiedAccount)
      );
      const isNice = await contract.isNice(req.body.address);
      if (isNice) {
        res.send(`Congrats your a nice person :) <br> Here is your flag: ${process.env.FLAG}`);
      } else {
        res.send(`${verifiedAccount} not nice enough to get the flag :(`);
      }
    } else {
      res.send("Invalid signature");
    }
  } else {
    res.send("Address and signature are required");
  }
}

main();
