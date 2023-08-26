// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace is ERC721URIStorage{

        constructor()ERC721("SNFT","SNFT"){}
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds;


        mapping(uint=>uint) private tokenPrice; // token id ==> token price
        mapping(address=>uint256[]) private totalOwnedNfts;

        event MintNFT(uint tokenId);

        function totalNft()external view returns(uint){
            return _tokenIds.current();
        }
        function nftPrice(uint256 tokenId)public view returns(uint){
            _requireMinted(tokenId);
            return tokenPrice[tokenId];
        }
        
        function approve(address to, uint256 tokenId) public pure override {}
        function safeTransferFrom(address from, address to, uint256 tokenId) public pure override {}
        function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public pure override {}
        function setApprovalForAll(address operator, bool approved) public pure  override {}
        function transferFrom(address from, address to, uint256 tokenId) public pure override {}

        function myNft()public view returns(uint256[] memory){
            address owner=msg.sender;
            require(owner!=address(0),"address can't be null");
            return totalOwnedNfts[owner];
        }

        function mint(uint price, string memory _tokenUri)public {
        require(price>0,"price should be getter than 0");
        address nftOwner=msg.sender;
        _tokenIds.increment();
        uint tid=_tokenIds.current();
        tokenPrice[tid]=price;
        _mint(nftOwner,tid);
        _setTokenURI(tid,_tokenUri);
        totalOwnedNfts[nftOwner].push(tid);
        emit MintNFT(tid);
        }

        function tokenURI(uint256 tokenId) public view override returns (string memory) {
            require(msg.sender==ownerOf(tokenId));
            return super.tokenURI(tokenId);
        }
        
        function tokenUri(uint256 tokenId) public payable  returns (string memory){
            uint256 price=tokenPrice[tokenId];
            require(price==msg.value,"Price should be matched");
            address owner=ownerOf(tokenId);
            payable(owner).transfer(price);
            return super.tokenURI(tokenId);
        }
}