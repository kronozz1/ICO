// SPDX-License-Identifier: MIT
pragma solidity^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IAmanDev.sol";
contract AmanDevToken is ERC20 , Ownable{
    IAmanDev AmanDevNFT; // first we have declared the same type of variable
    mapping(uint256 => bool) public tokenIdClaimed;
    uint256 public constant _price = 0.001 ether;
    uint256 public constant maxTokenPerNFT = 10 *10**18; // constant is for you are not gonna change its value;
    uint256 public constant maxTotalSupply = 10000 * 10**18;
    constructor (address _cryptodevContract) ERC20("Aman Dev Token","ADT"){
    AmanDevNFT = IAmanDev(_cryptodevContract); // Now here we are declaring that which contract is we want by addressing it
    }
    function mint(uint256 amount) public payable { // this function is for the users who want to mint by their own
        uint256 _requiredAmount = _price * amount;
        require(msg.value >= _requiredAmount , "Ether sent is not correct!");
        uint256 amountInDecimal =  amount *10 **18;
        require(totalSupply() + amountInDecimal <= maxTotalSupply , "Exceeds the max total supply available for the Aman Dev token");
        _mint(msg.sender , amountInDecimal);

    } 
    function claim() public { // here is function i created to give he user to claim how much nft they own to get the Aman dev token
        address sender = msg.sender;
        uint256 balance = AmanDevNFT.balanceOf(sender);
                    uint256 amount = 0;
        require(balance > 0 , "You don't own any Aman Dev NFT ");
        for(uint256 i=0 ; i < balance ; i++){
            uint256 tokenId = AmanDevNFT.tokenOfOwnerByIndex(sender , i);
            if(!tokenIdClaimed[tokenId]){
               amount += 1; 
               tokenIdClaimed[tokenId] = true;
            }
        }
        require(amount > 0 , "You have already claimed your Aman Dev Tokens");
        _mint(msg.sender , amount*maxTokenPerNFT);
    }
    receive() external payable{}
    fallback() external payable{}
}
