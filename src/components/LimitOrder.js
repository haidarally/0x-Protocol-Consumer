// import React, { useState } from "react";
// import { ZeroEx } from "0x.js";
// import { MetamaskSubprovider, Web3ProviderEngine } from "0x.js/lib/connectors";
// import { Order } from "@0xproject/types";

// const CreateLimitOrder = () => {
//   const [order, setOrder] = useState();

//   const handleCreateOrder = async () => {
//     const providerEngine = new Web3ProviderEngine();
//     providerEngine.addProvider(new MetamaskSubprovider(window.ethereum));
//     providerEngine.start();

//     const zeroEx = new ZeroEx(providerEngine);

//     // TODO: fill in the order details here
//     const newOrder = {
//       //...,
//     };

//     const orderHash = await zeroEx.exchange.getOrderHashAsync(newOrder);
//     const signature = await zeroEx.signOrderHashAsync(
//       orderHash,
//       zeroEx.getAvailableAddressesAsync()[0]
//     );

//     setOrder({ ...newOrder, signature });
//   };

//   return (
//     <div>
//       <button onClick={handleCreateOrder}>Create Limit Order</button>
//       {order && (
//         <div>
//           <p>Order created successfully!</p>
//           <p>Order hash: {order.orderHash}</p>
//           <p>Signature: {order.signature}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateLimitOrder;

// ////////////////////////////////////////////////////
export default [];
