const contractAbi = [
  "function goodDeed() public",
  "function isStarted(address _address) public view returns (bool)",
  "function start() public"
];

const contractAddress = "0x73D81979766A4076e73Da18786df983A80a86212";

async function activateMetamask() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const activatebtn = document.getElementById("connectWallet");
  activatebtn.innerHTML = `Connected to ${account}`;
  activatebtn.disabled = true;
  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x4") {
    document.getElementById("errors").innerHTML =
      "Please connect to the Rinkeby testnet";
    return;
  }

  const signer = getSigner()
  const contract = getContract(signer);

  const isStarted = await contract.isStarted(account);
  if (!isStarted) {
    document.getElementById("start").style.display = "block";
    return
  }

  document.getElementById("goodDeed").style.display = "block";
  document.getElementById("niceYet").style.display = "block";
}

async function niceYet() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const signer = getSigner()
  const message = await getRandomMessageFromServer(account);
  signature = await signer.signMessage(message);
  const reponseField = document.getElementById("response");
  reponseField.innerHTML = await getFlag(signature, account);
}

async function goodDeed() {
  const signer = getSigner()
  const contract = getContract(signer);
  try {
    const tx = await contract.goodDeed();
    const goodDeedBtn = document.getElementById("goodDeed-btn")
    goodDeedBtn.innerHTML = "Waiting for transaction to be confirmed...";
    goodDeedBtn.disabled = true;
    await tx.wait();
    goodDeedBtn.innerHTML = "Report a good dead!";
    goodDeedBtn.disabled = false;
  } catch(e) {
    document.getElementById("errors").innerHTML = e.error.message;
    console.error(e)
  }
}

async function start() {
  const signer = getSigner()
  const contract = getContract(signer);
  try {
    const tx = await contract.start();
    const startBtn = document.getElementById("start-btn")
    startBtn.innerHTML = "Waiting for transaction to be confirmed...";
    startBtn.disabled = true;
    await tx.wait();
    document.getElementById("start").style.display = "none";
    document.getElementById("goodDeed").style.display = "block";
    document.getElementById("niceYet").style.display = "block";
  } catch(e) {
    document.getElementById("errors").innerHTML = e.message;
    console.error(e)
  }
}

function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

function getContract(signer) {
  const contract =  new ethers.Contract(
    contractAddress,
    contractAbi,
    signer.provider
  );
  return contract.connect(signer)
}

async function getFlag(signature, account) {
  const flag = await fetch("/getFlag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signature: signature,
      address: account,
    }),
  });
  return await flag.text();
}

async function getRandomMessageFromServer(address) {
  const response = await fetch(`/randomMessage?address=${address}`);
  const message = await response.text();
  return message;
}

window.onload = function () {
  if (typeof window.ethereum === "undefined") {
    const button = document.getElementById("connectWallet");
    button.disabled = true;
    button.innerHTML = "Please install MetaMask";
  }
};

ethereum.on("chainChanged", () => {
  document.location.reload();
});
