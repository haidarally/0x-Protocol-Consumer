import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import contractAddresses from "@0x/contract-addresses";
import { ContractWrappers, IZeroExContract } from "@0x/contract-wrappers";
import { LimitOrder, SignatureType } from "@0x/protocol-utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { BigNumber, hexUtils } from "@0x/utils";
import { MetamaskSubprovider } from "@0x/subproviders";

const BuyToken = () => {
  //event.preventDefault();
  const [selected, setSelected] = useState("null");
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await await axios.get(
          "https://polygon.api.0x.org/orderbook/v1/orders"
        );
        setOrderList(res.data.records);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const selectedOrderHandler = (order) => {
    setSelected(order);
  };

  const fillOrder = async () => {
    try {
      //   const addresses =
      //     await contractAddresses.getContractAddressesForChainOrThrow({
      //       chainId: 137,
      //     });
      //console.log(`addresses ${addresses}`);
      // Connect to the user's wallet

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const order = new LimitOrder();

      const contractWrappers = new ContractWrappers(provider, { chainId: 137 });
      const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        new BigNumber(1),
        18
      );
      order.makerToken = selected.order.makerToken; //
      order.takerToken = selected.order.takerToken;
      order.makerAmount = selected.order.makerAmount;
      order.takerAmount = selected.order.takerAmount;
      order.maker = selected.order.maker;
      order.sender = selected.order.sender;
      order.expiry = selected.order.expiry;
      order.salt = selected.order.salt;
      order.chainId = selected.order.chainId;
      order.verifyingContract = selected.order.verifyingContract;

      console.log("before signature");
      //   const signature = await order.getSignatureWithProviderAsync(
      //     provider,
      //     SignatureType.EthSign
      //   );

      const orderHash = selected.metaData.orderHash;
      //const signature = selected.order.signature;
      console.log(`order hash ${orderHash}`);
      const rawSignature = await signer.signMessage(
        ethers.utils.hexlify(orderHash)
      );
      const { v, r, s } = ethers.utils.splitSignature(rawSignature);
      const signature = {
        v,
        r,
        s,
        signatureType: 3,
      };

      const supportedProvider = new MetamaskSubprovider(window.ethereum);

      const exchange = new IZeroExContract(
        selected.order.verifyingContract,
        supportedProvider
      );
      const gas = (await provider.getFeeData()).gasPrice;
      console.log(`gas ${gas}`);
      const TX_DEFAULTS = { gas: 910000000000, gasPrice: 20e9 };
      console.log("uhvwbdiebdi");

      const protocolFeeMultiplier = new BigNumber(1);
      const calculateProtocolFee = (
        numOrders,
        multiplier,
        gasprice = TX_DEFAULTS.gasPrice
      ) => {
        return multiplier.times(gasprice).times(numOrders);
      };

      const tx = await exchange
        .fillLimitOrder(order, signature, new BigNumber(order.takerAmount))
        .callAsync({
          from: "0xdb015fdbb742e9872bf9a319286e2b9bc4dc510e",
          ...TX_DEFAULTS,
        });

      //.sendTransactionAsync({
      // from: "0xdb015fDBb742e9872Bf9A319286E2B9Bc4dC510e",
      //   //    from: signer._address,
      //   value: new BigNumber(gas),
      // ...TX_DEFAULTS,
      //});

      //   console.log(calculateProtocolFee);
      //   const txHash = await contractWrappers.exchangeProxy
      //     .fillLimitOrder(order, signature, takerAssetAmount)
      //     .callAsync();
      // .sendTransactionAsync({
      //   from: signer._address,
      //   value: calculateProtocolFee(1, protocolFeeMultiplier),
      //   ...TX_DEFAULTS,
      // });

      console.log(tx);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rebase-form">
      <ul>
        {orderList.map((order) => {
          return (
            <li onClick={() => selectedOrderHandler(order)}>
              Maker Token: {order.order.makerToken}, Taker Token:
              {order.order.takerToken}, Maker Amount: {order.order.makerAmount},
              Price :{order.order.takerAmount}
            </li>
          );
        })}
      </ul>
      <button onClick={fillOrder}>Fill Order</button>
    </div>
  );
};

export default BuyToken;
