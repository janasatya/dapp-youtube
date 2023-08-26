import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import Cart from "./components/Cart.js";
import MintNFT from "./components/MintNft.js";
import { useState, useEffect } from "react";

import "./App.css";
import MyNft from "./components/MyNft.js";

function App() {
  const [allItem, setAllItem] = useState([1]);
  const [myItem, setMyItem] = useState([]);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [webApi, setWebApi] = useState({ provider: null, signer: null,contract:null });
  const [totalNft,setTotalNft]=useState(0);

  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Navbar
                setAccount={setAccount}
                connected={connected}
                setConnected={setConnected}
                setWebApi={setWebApi}
              />
            }
          >
            <Route
              index
              element={
                <Home
                  items={allItem}
                  myItem={myItem}
                  setMyItem={setMyItem}
                  setAllItem={setAllItem}
                  setTotalNft={setTotalNft}
                  webApi={webApi}
                  connected={connected}
                />
              }
            />
            {/* <Route
              path="mycart"
              element={
                <Cart
                  items={allItem}
                  myItem={myItem}
                  setMyItem={setMyItem}
                  setAllItem={setAllItem}
                  webApi={webApi}
                  account={account}
                  connected={connected}
                />
              }
            /> */}
            <Route
            path="mint"
            element={
              <MintNFT
              webApi={webApi}
              connected={connected}
              />
            }
            />
            <Route
            path="my-nft"
            element={
              <MyNft
              allItem={allItem}
              account={account}
              webApi={webApi}
              connected={connected}
              totalNft={totalNft}
              />
            }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
