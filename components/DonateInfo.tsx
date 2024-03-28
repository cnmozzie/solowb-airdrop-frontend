import {
    useConnection,
    useWallet,
    useAnchorWallet,
  } from "@solana/wallet-adapter-react"
  import * as anchor from "@project-serum/anchor"
  import { FC, useCallback, useEffect, useState } from "react"
  import idl from "../idl.json"
  import { Button, HStack, VStack, Text, Input } from "@chakra-ui/react"
  import BN from "bn.js";
  import { useTranslation } from 'react-i18next';
  
  const PROGRAM_ID = `2uebyRVefvi2GysvsgHkkRosDYfoa5qJDRZByadai8de`
  export const faucet = new anchor.web3.PublicKey(
    "H4uDLropG84finHeLskmpgQKibnmfCd6xziwMHCjN2du"
  );
  
  export interface Props {
    myDonate
    setMyDonate
    price
    setPrice
    setTransactionUrl
  }
  
  export const DonateInfo: FC<Props> = ({myDonate, setMyDonate, price, setPrice, setTransactionUrl}) => {
    const [totalSol, setTotalSol] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    //const [toDonate, setToDonate] = useState(0)
    const [table, setTable] = useState(0)
    const [program, setProgram] = useState<anchor.Program>()
    const { connection } = useConnection()
    const wallet = useAnchorWallet()

    const { t, i18n } = useTranslation();


    const [products, setProducts] = useState([
      {
        id: 1,
        image: '/mubei-min.png',
        price: 100,
        quantity : 0,
      },
      {
        id: 2,
        image: '/xianglu-min.png',
        price: 10,
        quantity : 0,
      },
      {
        id: 3,
        image: '/huaquan-min.png',
        price: 1,
        quantity : 0,
      },
      {
        id: 4,
        image: '/gold-min.png',
        price: 0.1,
        quantity : 0,
      },
    ]);
  
  
    const handleQuantityChange = (product, quantity) => {
      const newCart = [...products];
      const productIndex = newCart.findIndex((p) => p.id === product.id);
      newCart[productIndex].quantity = quantity;
      setProducts(newCart);
    };
  
    const getSubtotal = () => {
      return products.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const resetQuntity = () => {
      for (let product of products) {
        handleQuantityChange(product, 0)
      }
    }

    const [count, setCount] = useState(11);
  const [myImages, setMyImages] = useState([]);
  const [totalImages, setTotalImages] = useState([]);

  const donationChange = (value, setImages) => {
    const newCount = Math.floor(value*10);
    // const golds = Math.floor((e.target.value - newCount) * 10)
    setCount(newCount/10);
    const thousandsDigit = Math.floor(newCount / 1000);
    const hundredsDigit = Math.floor(newCount / 100) % 10;
    const tensDigit = Math.floor(newCount / 10) % 10;
    const onesDigit = newCount % 10;
    setImages([
      ...Array(thousandsDigit).fill('/mubei-min.png').map((image, index) => ({ image, key: index+10000 })),
      ...Array(hundredsDigit).fill('/xianglu-min.png').map((image, index) => ({ image, key: index+1000 })),
      ...Array(tensDigit).fill('/huaquan-min.png').map((image, index) => ({ image, key: index+100 })),
      ...Array(onesDigit).fill('/gold-min.png').map((image, index) => ({ image, key: index })),
    ]);
  };

  const handleShareOnTwitter = () => {
    //const productNames = cart.map((product) => product.name).join(', ');
    //const total = getSubtotal();
    const url = `https://airdrop.ashoflowb.com`;
    const tweetText = t('我捐赠了') + `${myDonate}` + t('支持葬礼仪式') + `${wallet.publicKey}`;
    const encodedTweet = encodeURIComponent(tweetText);
    //console.log(encodedTweet)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}&url=${url}`;
    window.open(twitterUrl, '_blank');
  };
  
    useEffect(() => {
      let provider: anchor.Provider
  
      try {
        provider = anchor.getProvider()
      } catch {
        provider = new anchor.AnchorProvider(connection, wallet, {})
        anchor.setProvider(provider)
      }
  
      const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID)
      setProgram(program)
      refreshInfo(program)
    }, [])
  
  
    const refreshInfo = async (program) => {
      
  
      const faucetInfo = await program.account.faucet.fetch(faucet)
      const solAmount = faucetInfo.solAmount

      const [USER_PDA] = await anchor.web3.PublicKey.findProgramAddress(
        [faucet.toBuffer(), wallet.publicKey.toBuffer()],
        program.programId
      );

      try {
        const userInfo = await program.account.userInfo.fetch(USER_PDA);
        setMyDonate(userInfo.donate.toNumber()/1e9)
        donationChange(userInfo.donate.toNumber()/1e9, setMyImages)
        setTable(userInfo.table)
      }
      catch(err) {
        console.log(err)
      }
      //console.log(faucetInfo)
      //console.log(userInfo.donate.toNumber()/1e9)

      setTotalSol(faucetInfo.solAmount.toNumber()/1e9)
      donationChange(faucetInfo.solAmount.toNumber()/1e9, setTotalImages)
      setTotalUsers(faucetInfo.userNumber)
      setPrice(faucetInfo.price)
      
    }

    const donateLamports = async (program) => {
        console.log('begin donate')

        const toDonate = getSubtotal()
        if (toDonate == 0) {return}

        const teamAccount = new anchor.web3.PublicKey(
          "8QJt3h5MSHjf8Cy3MdamDgwtBK9RYXP2th7uZjAJHorZ"
        );

        const [USER_PDA] = await anchor.web3.PublicKey.findProgramAddress(
          [faucet.toBuffer(), wallet.publicKey.toBuffer()],
          program.programId
        );

        
        const data = new BN(toDonate*1e9);
        console.log(data)
        const table = 0
        const sig = await program.methods
          .donateLamports(data, table)
          .accounts({
            faucet: faucet,
            userInfo: USER_PDA,
            user: wallet.publicKey,
            to: teamAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc()

        resetQuntity()
        refreshInfo(program)
        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=mainnet-beta`)
      }
  
    return (
      <>

      {!price && <>
      <div className="md:flex">
      <div className="md:w-full">
        <h1 className="text-3xl font-bold text-white">{t('Activity1')}</h1>
      </div>
    </div>
    <br/>
        
        <div className="md:flex">
         
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className=" shadow-md rounded-md p-4">
              <img src={product.image} alt="Product" className="w-full h-48 object-cover" />
              <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-bold text-white">{product.price} Sol</h2>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-center w-16"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

          </div>

          <div className="pt-2">
          <div className="bg-gray-800 text-white rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold px-4">
                Total: {getSubtotal()} Sol
              </h2>
              <button onClick={() => donateLamports(program)} className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm">
                {t('Donate Now!')}
              </button>
              <button onClick={() => refreshInfo(program)} className="bg-cyan-500 text-white px-4 py-2 rounded-md shadow-sm">
                Refresh info
              </button>
            </div>
          </div>
        </div>
      </>}
          
          
      {myDonate &&<div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-white">Your donations</h1>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-4 mt-4">
          {myImages.map((image) => (
            <img key={image.key} src={image.image} alt="Image" className="w-full h-48 object-cover" />
          ))}
        </div>
        {!price && <Text color="white">{t("开放空投")}</Text>}
      </div>
    </div>}

    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-white">Total donations with {totalUsers} sponsors</h1>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-4 gap-4 mt-4">
          {totalImages.map((image) => (
            <img key={image.key} src={image.image} alt="Image" className="w-full h-48 object-cover" />
          ))}
        </div>
      </div>
    </div>

    <div className="md:flex">
      <div className="md:w-full">
        <h1 className="text-3xl font-bold text-white">{t('Activity2')}</h1>
        
        <div className="text-white text-lg py-10">
          <p>Your points: 0 (the points is updated manually now, find the admin in the telegram group to update your points)</p>
        </div>

        <button onClick={handleShareOnTwitter} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm">
              {t('share on Twitter')}
        </button>
        
      </div>
    </div>

          {/*       <VStack>
        {!price && <label><Text color="white">Enter the number to donate:</Text>
              <Input 
                type="number"
                step="0.001" 
                color="white"
                onChange={(e) => setToDonate(Number(e.target.value))}
              />
        </label>}
        {!price && <HStack>
            <Button onClick={() => donateLamports(program)}>Donate sol now</Button>
            <Button onClick={() => refreshInfo(program)}>Refresh info</Button>
        </HStack>}
        <Text color="white">Your Donated Amount: {myDonate} sol</Text>
        <Text color="white">You are on table # {table}</Text>
        <Text color="white">Total Donated Amount: {totalSol} sol</Text>
        <Text color="white">Total Users: {totalUsers}</Text>
      </VStack>*/}
        </>

    )
  }
  