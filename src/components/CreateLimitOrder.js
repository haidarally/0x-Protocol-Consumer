import React, { useState } from "react";
import { ethers } from "ethers";

import { LimitOrder, SignatureType } from "@0x/protocol-utils";

const CreateLimitOrder = () => {
  const [makerToken, setMakerToken] = useState("");
  const [takerToken, setTakerToken] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [status, setStatus] = useState("N/A");

  const onSubmit = async (event) => {
    event.preventDefault();

    // Connect to the user's wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    //Using 0x libs to get addresses for Goerli
    const CHAIN_ID = 137;
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
    // const addresses =
    //   contractAddresses.getContractAddressesForChainOrThrow(CHAIN_ID);

    // Set up 0x contract instances
    // const zeroEx = new ZeroEx(provider);
    // const exchangeAddress = await zeroEx.exchange.getContractAddress();
    // const exchangeInstance = await zeroEx.exchange.getContractInstance();

    // Get the user's address
    const userAddress = await signer.getAddress();

    // Create the order object
    // const order = {
    //   makerAddress: makerToken,
    //   takerAddress: takerToken,
    //   feeRecipientAddress: ZeroEx.NULL_ADDRESS,
    //   senderAddress: ZeroEx.NULL_ADDRESS,
    //   makerAssetAmount: ZeroEx.toBaseUnitAmount(new BigNumber(amount), 18),
    //   takerAssetAmount: ZeroEx.toBaseUnitAmount(
    //     new BigNumber(amount).multipliedBy(price),
    //     18
    //   ),
    //   makerFee: ZeroEx.toBaseUnitAmount(new BigNumber(0), 18),
    //   takerFee: ZeroEx.toBaseUnitAmount(new BigNumber(0), 18),
    //   expirationTimeSeconds: new BigNumber(expirationTime),
    //   salt: ZeroEx.generatePseudoRandomSalt(),
    //   makerAssetData: ZeroEx.encodeERC20AssetData(makerToken),
    //   takerAssetData: ZeroEx.encodeERC20AssetData(takerToken),
    // };

    const getFutureExpiryInSeconds = () =>
      Math.floor(Date.now() / 1000 + ( 300)).toString(); // 5 min expiry
    //   {
    //     makerToken: makerToken,
    //     takerToken: takerToken,
    //     makerAmount: amount, // NOTE: This is 1 WEI, 1 ETH would be 1000000000000000000
    //     takerAmount: price, // NOTE this is 0.001 ZRX. 1 ZRX would be 1000000000000000000
    //     maker: userAddress,
    //     sender: NULL_ADDRESS,
    //     expiry: getFutureExpiryInSeconds(),
    //     salt: Date.now().toString(),
    //     chainId: CHAIN_ID,
    //     verifyingContract: "0xf91bb752490473b8342a3e964e855b9f9a2a668e",
    //   }
    try {
      let order = new LimitOrder();
      order.makerToken = makerToken; //
      order.takerToken = takerToken;
      order.makerAmount = amount;
      order.takerAmount = price;
      order.maker = userAddress;
      order.sender = NULL_ADDRESS;
      order.expiry = getFutureExpiryInSeconds();
      order.salt = Date.now().toString();
      order.chainId = CHAIN_ID;
      order.verifyingContract = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";
      //   const signature = await order.getSignatureWithProviderAsync(
      //     provider,
      //     SignatureType.EIP712 // Optional
      //   );
      const orderHash = order.getHash();
      const rawSignature = await signer.signMessage(
        ethers.utils.arrayify(orderHash)
      );
      const { v, r, s } = ethers.utils.splitSignature(rawSignature);
      const signature = {
        v,
        r,
        s,
        signatureType: 3,
      };

      const signedOrder = { ...order, signature };
      console.log(JSON.stringify(signedOrder));
      try {
        const resp = await fetch(
          "https://polygon.api.0x.org/orderbook/v1/order",
          {
            method: "POST",
            body: JSON.stringify(signedOrder),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(resp);
        if (resp.status === 200) {
          setStatus(`Order Success!`);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }

    // Sign the order with the user's private key
    //const orderHash = ZeroEx.getOrderHashHex(order);
    // const signature = await signer.signMessage(
    //   ethers.utils.arrayify(orderHash)
    // );

    // Submit the order to the exchange
    // await exchangeInstance.fillOrder(
    //   order,
    //   new BigNumber(order.takerAssetAmount),
    //   signature,
    //   { from: userAddress }
    // );
  };

  return (
    <form onSubmit={onSubmit}>
      <label>Order Status : {status}</label>
      <label>
        Maker Token:
        <input
          type="text"
          value={makerToken}
          onChange={(event) => setMakerToken(event.target.value)}
        />
      </label>
      <label>
        Taker Token:
        <input
          type="text"
          value={takerToken}
          onChange={(event) => setTakerToken(event.target.value)}
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>
      <label>
        Amount:
        <input
          type="text"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>
      <label>
        Expiration time in seconds:
        <input
          type="text"
          value={expirationTime}
          onChange={(event) => setExpirationTime(event.target.value)}
        />
      </label>
      <button type="submit">Create Limit Order</button>
    </form>
  );
};

export default CreateLimitOrder;

//Matic: 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
//TEST: 0xe61334063361408Cb23351a72375D9CbF8399fDE
//https://ethereum.stackexchange.com/questions/111651/the-remainingfillabletakeramount-of-new-sell-order-is-zero-on-polygon-and-it-las
