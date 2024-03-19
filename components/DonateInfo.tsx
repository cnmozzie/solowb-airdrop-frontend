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
  
  const PROGRAM_ID = `2uebyRVefvi2GysvsgHkkRosDYfoa5qJDRZByadai8de`
  export const faucet = new anchor.web3.PublicKey(
    "CAFaKUidizzr3epvHbEY5Zmk6d8jGQTodmNvjHMDBAuG"
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
    const [toDonate, setToDonate] = useState(0)
    const [program, setProgram] = useState<anchor.Program>()
    const { connection } = useConnection()
    const wallet = useAnchorWallet()
  
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
      }
      catch(err) {
        console.log(err)
      }
      //console.log(faucetInfo)
      //console.log(userInfo.donate.toNumber()/1e9)

      setTotalSol(faucetInfo.solAmount.toNumber()/1e9)
      setTotalUsers(faucetInfo.userNumber)
      setPrice(faucetInfo.price)
      
    }

    const donateLamports = async (program) => {
        console.log('begin donate')

        const teamAccount = new anchor.web3.PublicKey(
          "8QJt3h5MSHjf8Cy3MdamDgwtBK9RYXP2th7uZjAJHorZ"
        );

        const [USER_PDA] = await anchor.web3.PublicKey.findProgramAddress(
          [faucet.toBuffer(), wallet.publicKey.toBuffer()],
          program.programId
        );

        const data = new BN(toDonate*1e9);
        console.log(data)
        const sig = await program.methods
          .donateLamports(data)
          .accounts({
            faucet: faucet,
            userInfo: USER_PDA,
            user: wallet.publicKey,
            to: teamAccount,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc()

        setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
      }
  
    return (
      <VStack>
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
        <Text color="white">Total Donated Amount: {totalSol} sol</Text>
        <Text color="white">Total Users: {totalUsers}</Text>
      </VStack>
    )
  }
  