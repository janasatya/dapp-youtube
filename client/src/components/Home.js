import { BigNumber, ethers } from "ethers";
import { useState,  useEffect} from "react";
import { Contract_Address, ALCHEMY_KEY} from "../others/config";
import ABI from '../others/Marketplace.json'

export default function Home(props) {
  let allItem = props.items;
  const [reload,setReload]=useState(true);
  const [total,setTotal]=useState(0);
  const [items,setItems]=useState([])
  const [accessItems,setAccessItems]=useState(null)
  const [count,setCount]=useState(0)

  useEffect(()=>{
    async function fetchData(){
      try{
      const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_KEY);
      const abi = ABI.abi;
      const contract = new ethers.Contract(Contract_Address, abi, provider);
      let i=1;
      let tem=[];
      let temacc=[];
      let totalNft=await contract.totalNft();
      totalNft=Number(totalNft);
      setTotal(totalNft);
      for(let i=1;i<=totalNft;i++){
        let price=await contract.nftPrice(i);
        price=ethers.utils.formatEther(price)
        tem.push({price:Number(price),tokenUri:null,isAccess:false});
        temacc.push(false);
      }
      // while(true){
      //   const data=await contract.getNftData(BigNumber.from(i));
      //   const price=ethers.utils.formatEther(data[0])
      //   const isSold=data[1];
      //   if(isSold){
      //     i++;
      //     continue;
      //   }
      //   if(price==0)
      //   break;

      //   const tokenUri=await contract.tokenURI(BigNumber.from(i));
      //   tem.push({id:i,price:price,tokenUri:tokenUri});
        
      //   i++;
      // }
      // props.setTotalNft(i-1);
      // const allItems = await Promise.all(
      //   tem.map(async (item) => {
      //     let meta = await fetch(item.tokenUri);
      //     meta = await meta.json();
      //     return {
      //       id:item.id,price:item.price,image:meta.image
      //     };
      //   })
      // );
      // console.log(tem)
      props.setAllItem(tem);
      // props.setMyItem([]);
      setItems(tem);
      setAccessItems(temacc);
      setReload(false)
      }catch(error){
        console.log(error);
        alert("Please reload the page");
        return;
      }
    }
    fetchData();
  },[])

  async function view(i) {
    if(!props.connected){
      alert("Connect your wallet");
      return;
    }
    try{
    const {contract}=props.webApi;
    let price=items[i].price;
    price=await ethers.utils.parseUnits(price.toString(),'ether');
    let isAccess=await contract.isAccess(BigNumber.from(i+1),{from:props.account});
    let arr=items;
    let temacc=accessItems;
    if(Number(isAccess)==0){
      const transaction=await contract.payForAccess(BigNumber.from(i+1),{value:price})
      const uri=await transaction.wait();
      console.log(uri);
    }else{
    }
  arr[i].isAccess=true;
  temacc[i]=true;
    const metadata=await contract.tokenUri(BigNumber.from(i+1),{from:props.account});
    let meta=await fetch(metadata);
          console.log(meta);
          meta=await meta.json();
          arr[i].tokenUri=meta.image;
    console.log(arr);
    setItems(arr);
    setAccessItems(temacc);
    setCount(count+1);
  }catch(err){
    console.log(err);
    alert("reload the page");
    return;
  }
  }
  
  if(reload){
    return (
      <div className='text-4xl text-center m-20'>
            Wait for a minute........
        </div>
    )
  }
  if(items.length==0){
    return (
        <div className="text-2xl m-20 text-center">
            No Item is Here
        </div>
    )
  }
  if(count>=0)
  return (
    <div className="m-10">
      <div className="flex flex-wrap gap-4 content-start  m-auto ">
        {items.map((item, i) => {
          return (
            <li className="list-none border-2 border-grey bg-slate-200 p-3 rounded-lg" key={i+1}>
              { item.tokenUri!=null && <video controls className="h-[200px]" controlsList="nodownload">  
        <source src={item.tokenUri} type="video/mp4"/>  
        Your browser does not support the html video tag.  
        </video> }
                {item.tokenUri==null && <img src="/sc1.png" alt="#" className="h-[200px]"/>}
              <div>
                <button
                  className="bg-cyan-700 text-white w-full  py-2 font-bold tracking-wide group"
                  onClick={() => {
                    view(i);
                  }}
                >
                  <p className="group-hover:hidden transition">
                  Price- {item.price} eth
                  </p>
                  <p className=" hidden group-hover:inline transition">
                  View
                  </p>
                </button>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
}
