import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from 'react';
import { NFTabi , NFTAddress, TokenAddress , Tokenabi} from '../contants';
import Web3Modal from 'web3modal';
import {providers , Contract , BigNumber , utils} from 'ethers';
export default function Home() {
    const zero = BigNumber.from(0);
  const [walletConnected , setwalletConnected] = React.useState(false)
  const [balanceOfAmanDevTokens ,setbalanceOfAmanDevTokens] = React.useState(zero);
      const [TokenMinted , setTokenMinted] = React.useState(zero);
  const [loading , setloading] = React.useState(false);
  const [tokenAmount , settokenAmount] = React.useState(zero);
        console.log(tokenAmount)
  const [tokenToBeClaimed , settokenToBeClaimed] = React.useState(zero);
  const ModelRef= React.useRef();
  const getSignerOrProvider = async(needSigner = false) =>{
    const provider = await ModelRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const {chainId} = await web3Provider.getNetwork();
    if(chainId != 421613){
      window.alert("Change Your Network to Aman's Network");
      throw new Error("Change Your Network to Aman's Network");
    }
    if(needSigner){
      const signer = await web3Provider.getSigner();
      console.log('signer is here');
      return signer;
    }
    return web3Provider;
  }
  const gettokenClaimed = async() =>{
    try{
          const provider = await getSignerOrProvider();
      const tokencontract = new Contract(TokenAddress , Tokenabi , provider);
      const nftContract = new Contract(NFTAddress , NFTabi, provider);
      const signer = await getSignerOrProvider(true);
      const address = await signer.getAdress();
      const balance = await nftContract.balanceOf(address);
      if(tokenToBeClaimed === zero){
        settokenToBeClaimed(zero);
      }else{
        var amount = 0;
        for(var i =0 ; i< balance ; i++){
          const tokenId= await nftContract.tokenOfOwnerByIndex(address , i);
          const claimed = await tokencontract.tokenIdClaimed(tokenId);
          if(!claimed){
            amount++
          }
        }
        settokenToBeClaimed(BigNumber.from(amount));
      }
    }catch(err){
      console.error(err);
      settokenToBeClaimed(zero);
    }
  }
  const getBlanceTokenAmanDevToken = async() =>{
    try{
    const provider = await getSignerOrProvider();
    const myContract = new Contract(TokenAddress , Tokenabi , provider);
      const signer = await getSignerOrProvider(true);
      const address = await signer.getAddress();
    const balance = await myContract.balanceOf(address);

    }catch(err){
      console.error(err);
    }
  }
  const getTotalTokenMinted = async() =>{
    try{
  const provider = await getSignerOrProvider();
    const myContract = new Contract(TokenAddress , Tokenabi , provider);
    const _tokenMinted = await myContract.totalSupply();
    setTokenMinted(_tokenMinted);
    }catch(err){
      console.error(err);
    }

  }
  const mintAmanTokens = async(amount)=>{
    try{
      const signer = await getSignerOrProvider(true);
    const myContract = new Contract( TokenAddress ,Tokenabi , signer);
      const value = 0.001*amount; // js is recognising it as a number 
    const txn = await myContract.mint(amount,{value:utils.parseEther(value.toString()),}); // we need to convert it to BigNumber (so we make it a string cuz parse Ether takes string)
      setloading(true);
      await txn.wait();
      setloading(false);
      window.alert('successfully minted Aman Dev Token');
      await getBlanceTokenAmanDevToken();
      await gettotaltokenminted();

    }catch(err){
      console.error(err);
    }
  }
  const claimAmanDevTokens = async() =>{
    try{
    const signer = await getSignerOrProvider(true);
    const myContract = new Contract (
      TokenAddress,
      Tokenabi,
      signer
    );
    const txn = await myContract.claim()
      setloading(true);
      await txn.wait();
      setloading(false);
      window.alert("successfully claimed Aman Dev Token");
      await getBlanceTokenAmanDevToken();
      await getTotalTokenMinted();
      await gettokenClaimed();
    }catch(err) {
      console.error(err);
    }
  }
  const renderButton = () =>{
    if(loading){
      return(
        <div>
        <button className={styles.button}>Loading...</button>
        </div>
      )
    }
    if(tokenToBeClaimed > 0){
      return(
                <div>
          <div className={styles.description}>
            {tokenToBeClaimed * 10} Tokens can be claimed!
          </div>
          <button className={styles.button} onClick={claimAmanDevTokens}>
            Claim Tokens
          </button>
        </div>
      );
    }
    return(
      <div style={{ display : "flex-col"}}>
      <div>
      <input type="number" placeholder="Amount of tokens" onChange={(e) => settokenAmount(BigNumber.from(e.target.value))} />
      <button className={styles.button} disabled={!(tokenAmount > 0)} onClick={()=>mintAmanTokens(tokenAmount)}>Mint token</button>
      </div>
      </div>

    )
  }
  const connectWallet = async () =>{
    try{
          await getSignerOrProvider();
      setwalletConnected(true);
    }catch(err){
      console.error(err);
    }
  }
  React.useEffect(()=>{
    if(!walletConnected){
      ModelRef.current = new Web3Modal({
        networks:"arbitrum-goerli",
        providerOptions:{},
        disabledInjectedProvider:false,
      })
      connectWallet();
       getBlanceTokenAmanDevToken();
       getTotalTokenMinted();
       gettokenClaimed();
    }
  },[walletConnected]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Aman dev ICO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
          <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Aman Devs ICO!</h1>
          <div className={styles.description}>
            You can claim or mint Aman Dev tokens here
          </div>
          {walletConnected ? (
            <div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                You have minted {utils.formatEther(balanceOfAmanDevTokens)} Aman 
                Dev Tokens
              </div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall {utils.formatEther(TokenMinted)}/10000 have been minted!!!
              </div>
              {renderButton()}
            </div>
          ) : (
            <button onClick={connectWallet} className={styles.button}>
              Connect wallet
            </button>
          )}
        </div>
        <div>
          <img className={styles.image} src="./0.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Aman Faridi 
      </footer>
    </div>
  )
}
