import { BigNumber, ethers } from "ethers";
import { useState, useEffect } from "react";


export default function MyNft(props) {
  const [myItem, setMyItem] = useState([]);
  const [reload, setReload] = useState(true);



  useEffect(() => {
    async function fetchData() {
      if (!props.connected) {
        alert("Connect your wallet");
        return;
      }
      try {
        const { contract } = props.webApi;
        let items = [];
        // for (let i=1;i<=props.totalNft;i++) {
        //   let address = await contract.ownerOf(BigNumber.from(i));
        //   if (address == props.account){
        //     const metadata=await contract.tokenURI(BigNumber.from(i));
        //     let meta = await fetch(metadata);
        //   meta = await meta.json();
        //     items.push({id:i,image:meta.image});
        //   }
        // }
        // console.log(items);
        // setMyItem(items);
        const tokenArray=await contract.myNft({from:props.account});
        const myTokenArray=tokenArray.map((item)=>{
          return Number(item);
        })
        console.log(myTokenArray);
        for(let i of myTokenArray){
          const metadata=await contract.tokenURI(BigNumber.from(i));
          let meta=await fetch(metadata);
          console.log(meta);
          meta=await meta.json();
          items.push({id:i,image:meta.image});
        }
        console.log(items)
        setMyItem(items);
        setReload(false)
      } catch (err) {
        console.log(err);
        alert("Reload the page");
        return;
      }
    }
    fetchData();
  }, []);

  if (reload) {
    return (
      <div className="text-4xl text-center m-20">Wait for a minute........</div>
    );
  }
  if(myItem.length==0){
    return (
        <div className="text-2xl m-20 text-center">
            No Item is Here
        </div>
    )
  }

  return (
    <div>
      <div className="m-10 ">
        <div className="flex flex-wrap gap-4 content-start m-auto ">
          {myItem.map((item, i) => {
            return (
              <li
                className="list-none border-2 border-grey bg-slate-200 p-3 rounded-lg"
                key={i + 1}
              >
                {/* <img src={item.image} alt="" className="h-[300px]" /> */}
                <video controls className="h-[200px]">  
        <source src={item.image} type="video/mp4"/>  
        Your browser does not support the html video tag.  
        </video>
                <div>
                  <div className="bg-cyan-700 text-center py-2 text-white">
                    Token Id: {item.id}
                  </div>
                </div>
              </li>
            );
          })}
        </div>
      </div>
    </div>
  );
}
