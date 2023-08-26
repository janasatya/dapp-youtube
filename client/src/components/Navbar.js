import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Web3modal from "web3modal";
import { ethers } from "ethers";
import ABI from "../others/Marketplace.json"
import {Contract_Address} from "../others/config"

export default function Navbar(props) {


  async function connectWallet() {
    try {
      const web3modal = new Web3modal();
      const connection = await web3modal.connect();
      const provider = await new ethers.providers.Web3Provider(connection);
      const signer = await provider.getSigner();
      // console.log(await signer.getAddress())
      props.setAccount(await signer.getAddress());
      const network = await provider.getNetwork();
      // if (network.chainId != 355113) {
      //   alert("Please connect with Bitnifty test network");
      //   return;
      // }
      const contract =await new ethers.Contract(Contract_Address,ABI.abi,signer);
      props.setWebApi({provider,signer,contract});
      props.setConnected(true);
    } catch (e) {
      alert("Please reload the page");
      return;
    }
  }

  return (
    <div>
      <div className="bg-cyan-800 p-4 text-white">
        <div className="w-2/3 m-auto flex justify-between">
          <div className="text-2xl">
            <Link to="/">NFT Marketplace</Link>
          </div>
          <div className="flex text-xl">
            <div className="text-xl mx-5">
              <Link to="/mint">Mint NFT</Link>
            </div>
            <div className="text-xl mx-5">
              <Link to="/my-nft">My NFT</Link>
            </div>
            {/* <div className="text-xl mx-10">
              <Link to="/mycart">Cart</Link>
            </div> */}
            <button className="" onClick={connectWallet}>
              {props.connected ? "Connected" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
