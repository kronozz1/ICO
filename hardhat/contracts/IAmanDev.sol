//SPDX_License-Identifier:MIT
pragma solidity ^0.8.17;
interface IAmanDev {
    // this function here will show us that how much nft does the given adderess have by index.
    // this function is used to see that if a tokenId is minted like:( AmanDev[1],...) so it connot be minted again (thats all it is)
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns(uint256 tokenId); 
    // this function will only return the total number of nft you own like( kronoz have 5 nft);
    function balanceOf( address owner) external view returns(uint256 balance);
}
