async function activateMetamask() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const button = document.getElementById("connectWallet");
  button.innerHTML = `Try again`;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const message = await getRandomMessageFromServer(account);
  signature = await signer.signMessage(message);
  console.log(`Signature: ${signature}`);

  const reponseField = document.getElementById("serverResponse");
  reponseField.innerHTML = await getFlag(signature, account);
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
