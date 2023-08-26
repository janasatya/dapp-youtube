import { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";

export default function Cart(props){
    let myItem = props.myItem;

    const [price,setPrice]=useState(null)
    const [reload,setReload]=useState(false)
    const [succes,setSuccces]=useState(false);
    const [pretime,setPretime]=useState(0);
    const [posttime,setPosttime]=useState(0);
    useEffect(()=>{
        let sum=0;
        for( let i of myItem){
            let t=Number(i.price)
            sum+=t;
        }
        setPrice(sum);
    },[])

  function change(i) {
    let item = myItem[i];
    let p=item.price;
    setPrice(price-p);
    let newItems = myItem.slice(0, i).concat(myItem.slice(i + 1));
    props.setMyItem(newItems);
    let allItem = props.items;
    allItem.push(item);
    props.setAllItem(allItem);
  }
  async function buy(){
    try{
    if(!props.connected){
      alert("Please connect your wallet");
      return;
    }
    setReload(true)
    const {contract}=props.webApi;
    const cartItemPrice=myItem.map((it)=>{
      return BigNumber.from(it.price*1000000).mul(1000000000000n);
    })
    let tprice=0n;
    for(let i of cartItemPrice){
      tprice=i.add(tprice);
    }
    const totalPrice=await ethers.utils.parseUnits(tprice.toString(),'wei');
    console.log(myItem);
    const cartItems=myItem.map((it)=>{
      return BigNumber.from(it.id);
    })
    const transaction=await contract.buyNFTs(cartItems,{value:totalPrice});
    let date=new Date();
    setPretime(date.getMinutes()*60+date.getSeconds());
    console.log(date.getMinutes()*60+date.getSeconds())
    const trans=await transaction.wait();
    console.log(trans);

    let ndate=new Date();
    setPosttime(ndate.getMinutes()*60+ndate.getSeconds());
    console.log(ndate.getMinutes()*60+ndate.getSeconds());
    setSuccces(true)
    setReload(false)
    props.setMyItem([])
    }
    catch(e){
      alert("Transaction Failed, Try again");
      console.log(e);
      setReload(false)
      return;
    }
    }

  if(props.myItem.length==0 && !succes){
    return (
        <div className="text-2xl m-20 text-center">
            No Item is Here
        </div>
    )
  }
  if(succes){
    return (
        <div className="text-2xl m-20 text-center">
            Total trnsaction time: {posttime-pretime}
        </div>
    )
  }

  if (reload) {
    return (
      <div className="text-4xl text-center m-20">Wait for a minute........</div>
    );
  }

  return (
    <div className="m-10 ">
      <div className="flex flex-wrap gap-4 justify-center w-4/6 m-auto ">
        {myItem.map((item, i) => {
          return (
            <li className="list-none border-2 border-grey bg-slate-200 p-3 rounded-lg" key={i+1}>
              <img src={item.image} alt="" className="h-[300px]" />
              <div>
                <span className="bg-cyan-700 w-1/2 inline-block py-2 text-white">
                  Price: {item.price} eth
                </span>
                <button
                  className="bg-black text-white w-1/2 py-2"
                  onClick={() => {
                    change(i);
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </div>
      <div className="text-center mt-[30px] text-white text-lg">
      <span className="p-5 px-20 rounded-lg bg-sky-700">Total Price: {Math.round(price*1000)/1000} eth</span>
      <button className="p-4 px-20 rounded-lg bg-cyan-700" onClick={buy}>Buy Now</button>
      </div>
    </div>
  );
}