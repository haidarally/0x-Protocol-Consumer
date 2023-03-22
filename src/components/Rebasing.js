import React, { useState } from "react";
import { ethers } from "ethers";
import abiFile from "../ABI/abi.json";

const Rebasing = () => {
  //event.preventDefault();
  const contractAddress = "0xe61334063361408Cb23351a72375D9CbF8399fDE";
  //state
  const [amount, setAmount] = useState("");
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRebase = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abiFile.abi, signer);

    const timestamp = Math.floor(Date.now() / 1000); // current timestamp
    const amountInWei = ethers.utils.parseEther(amount.toString());

    try {
      const tx = await contract.rebase(timestamp, amountInWei);
      await tx.wait();
      alert("Rebase successful!");
    } catch (e) {
      console.error(e);
      alert("Error occurred. Please try again later.");
    }
  };
  return (
    <div className="rebase-form">
      <h2>Testium Rebase</h2>
      <p className="epoch">
        Epoch (generated dynamically): {Math.floor(Date.now() / 1000)}
      </p>
      <input
        className="rebase-form__input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={handleAmountChange}
      />
      <button className="rebase-form__button" onClick={handleRebase}>
        Rebase
      </button>
    </div>
  );
};

export default Rebasing;
