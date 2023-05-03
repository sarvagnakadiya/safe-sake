import "./App.css";
import React, { useEffect, useState } from "react";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { ethers } from "ethers";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/safe-core-sdk";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import abi from "./erc.json";
import SafeServiceClient from "@safe-global/safe-service-client";

function App() {
  const contractAddress = "0x1ac9D0e7c47561829898a61cA429AEC1DAbe56D5";

  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [ethAdapter, setAdapter] = useState();
  const [instance, setInstance] = useState();

  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
    const signer = provider.getSigner();
    setSigner(signer);

    const addr = await signer.getAddress();
    setAddress(addr);
    console.log(addr);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    setAdapter(ethAdapter);
    console.log(ethAdapter);
  };

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://eth-goerli.g.alchemy.com/v2/welDuFTBZcdINPCirTOy4UgeEfOPmsRp"
  // );

  // Create a wallet instance using the private key
  // const wallet = new ethers.Wallet(privateKey);

  // Get the signer from the wallet
  //----------------------------------------------------------------
  const acc = async () => {
    console.log("in acc");

    const safeService = new SafeServiceClient({
      txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
      ethAdapter,
    });
    // txServiceUrl: "https://safe-transaction-goerli.safe.global/",

    console.log("safe service");
    console.log(safeService);

    const safes = await safeService.getSafesByOwner(
      "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb"
    );
    console.log(safes);
    console.log(safes.safes[2]);

    const safeInfo = await safeService.getSafeInfo(safes.safes[2]);
    console.log("get safe info");
    console.log(safeInfo);

    // const safeFactory = await SafeFactory.create({ ethAdapter });
    // const owners = [
    //   "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb",
    //   "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
    //   "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
    // ];
    // const threshold = 3;

    // const safeFactory = await SafeFactory.create({ ethAdapter }); //4
    // const safeSdk = await safeFactory.deploySafe({
    //   safeAccountConfig: {
    //     threshold: 2,
    //     owners: [
    //       "0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb",
    //       "0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8",
    //       "0xcc920c851327AF767b4bf770e3b2C2ea50B90fde",
    //     ],
    //   },
    // });
    // setSafeSdk(safeSdk);
    // console.log(safeSdk);
    // console.log("done");
    const safeAddress = "0xaF88be40b6ab8Ca721D1FE569F21B136C0139255";
    // const safeSdk = await Safe.create({ ethAdapter, "0x7fD8A1A0F6E73C85A7D2be47078c94721Df1502b" });
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log("instance");
    console.log(safeSdk);
    setInstance(safeSdk);

    // const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 2, owners: ['0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb', '0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8', '0xbFc4A28D8F1003Bec33f4Fdb7024ad6ad1605AA8'] }});
    // const safeAccountConfig = {
    //   owners,
    //   threshold,
    //   // ...
    // };
    // const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    // const newSafeAddress = safeSdk.getAddress();
    // console.log(newSafeAddress);
  };

  const createAcc = async () => {
    const safeFactory = await SafeFactory.create({ ethAdapter });

    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig: {
        threshold: 1,
        owners: ["0xcc4091815292B2D3BB3076022Dc72d432B6cAdEb"],
      },
    });

    console.log(safeSdk);
    console.log("done");

    const safeTransaction = await safeSdk.getAddress();
    console.log(safeTransaction);
  };

  const sign = async () => {
    // const functionSignature = "please(uint)";
    // const parameters = ["Hello"];
    // const encodedFunction = ethers.utils.defaultAbiCoder.encode(
    //   ["string", "string"],
    //   [functionSignature, ...parameters]
    // );
    // const encodedFunction =
    //   "0xa80121090000000000000000000000000000000000000000000000000000000000000007";
    // console.log(encodedFunction);
    // const contract_address = "0xE648F46aEE4c3ec13c1870bE0AdB5307c1a941b7";

    // const safeTransaction = await instance.getAddress();
    // console.log(safeTransaction);
    const safeTransactionData = {
      to: "0xd15514e269554BABb74EDa41dC99381f8507FcfF",
      data: "0xa80121090000000000000000000000000000000000000000000000000000000000000005",
      value: "0", // 1 ETH in wei
    };

    const safeTransaction = await instance.createTransaction({
      safeTransactionData,
    });
    console.log(safeTransaction);

    const sign = await instance.executeTransaction(safeTransaction);
    console.log(sign);
    console.log("5 now");
  };

  const encode = async () => {
    const contractAddress = "0xd15514e269554BABb74EDa41dC99381f8507FcfF";
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const functionName = "please";
    const functionArgs = 7;

    const functionData = contract.interface.encodeFunctionData(functionName, [
      functionArgs,
    ]);
    // const functionAbi = abi.find(
    //   (a) => a.name === functionName && a.type === "function"
    // );
    // const functionSignature = ethers.utils.keccak256(
    //   ethers.utils.toUtf8Bytes(functionAbi.format())
    // );

    // const encodedFunctionArgs = ethers.utils.defaultAbiCoder.encode(
    //   functionAbi.inputs,
    //   functionArgs
    // );
    // const rawTransactionData =
    //   "0x" + functionSignature.substr(2, 8) + encodedFunctionArgs.substr(2);

    console.log(functionData);
  };
  return (
    <div>
      <button onClick={() => acc()}>click</button>
      <button onClick={() => createAcc()}>create address</button>
      <button onClick={() => sign()}>sign</button>
      <button onClick={() => encode()}>encode</button>
    </div>
  );
}

export default App;
