import { useState,useEffect } from 'react';
import {Contract_Address,pinata} from '../others/config.js'
import { ethers } from 'ethers';
// //import ABI from '../abi/Library.json'
// import Web3Modal from 'web3modal'
// import Image from 'next/image';
// import {useRouter} from 'next/router';
import axios from "axios"



export default function MintNFT(props){
    const [image,setImage]=useState(null)
    const [fileUrl,setFileUrl]=useState(null)
    const [price,setPrice]=useState(null)
    const [reload,setReload]=useState(false)

    const uploadImage=async(e)=>{
        try{
            setReload(true)
            let img=e.target.files[0];
            const formData = new FormData();
            formData.append("file",img);
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers:{
                    'pinata_api_key':pinata.APIKey,
                    'pinata_secret_api_key':pinata.APISecret,
                    'Content-Type':'multipart/form-data'
                },
            });

            const ImageURL = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log(ImageURL);
            setFileUrl(ImageURL);
            setReload(false)
        }
        catch(err){
            console.log(err)
            alert("error to upload")
            setReload(false)
            return
        }
    }

    async function uploadMetadata(){

        try{
            const metadata=JSON.stringify({
                    "description":"NA",
                    "image":await fileUrl,
                    "price":price
            });
            const resFile=await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                    data: metadata,
                    headers:{
                        'pinata_api_key':pinata.APIKey,
                        'pinata_secret_api_key':pinata.APISecret,
                        'Content-Type':'application/json'
                    },
            })
            const tokenUri=`https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log("tokenUrl",tokenUri);
            return tokenUri;
        }
        catch(err){
            alert("metadata upload fail")
            return
        }
    }

    async function mintNft(){
        if(price==null || image==null){
            alert("something wrong");
            return;
        }
        try{
            setReload(true)
        const {contract}=props.webApi;
        const tokenUri=await uploadMetadata();
        const itemPrice=await ethers.utils.parseUnits(price.toString(),'ether');
        const transaction=await contract.mint(itemPrice,tokenUri);
        await transaction.wait();
        setReload(false)
        }catch(e){
            alert("Transaction failed")
            setReload(false)
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
    if(!props.connected){
        alert("Please connect your wallet");
        return;
    }
    return(
        <div className="flex w-1/2 justify-around m-auto mt-20" >
            <div className='rounded-lg p-4 bg-slate-100'>{
                (fileUrl==null) && <img src="/logo192.png" alt="#" />
            }
            {
                (fileUrl !=null) && <video controls className="h-[200px]" controlsList='nodownload'>  
                <source src={fileUrl} type="video/mp4"/>  
                Your browser does not support the html video tag.  
                </video>
            }
            </div>
            <div className="rounded-lg p-6 bg-slate-100">
                <div className="block my-8">
                <label htmlFor="img" className='font-bold'>Vedio: </label>
                <input type="file" name="img" id="img" 
                onChange={
                    (e)=>{
                        setImage(e.target.files[0]);
                        uploadImage(e);
                    }
                }
                />
                </div>
                <div className='m-2'>
                <label htmlFor="price" className='font-bold'>Price: </label>
                <input type="number" name="price" id="price" className='border-black border-2 p-1'onChange={(e)=>{
                    setPrice(e.target.value);
                }}/>
                </div>
                <button type="submit" className="border-2 border-black py-1 rounded bg-sky-300 px-10 text-lg w-full" onClick={mintNft}>submit</button>
            </div>
        </div>
    )
}