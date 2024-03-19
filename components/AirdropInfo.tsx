import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react"
import * as anchor from "@project-serum/anchor"
import { FC, useEffect, useState } from "react"
import idl from "../idl.json"
import BN from "bn.js";
import { Button, HStack, VStack, Text, Input } from "@chakra-ui/react"
import * as spl from "@solana/spl-token";

const PROGRAM_ID = new anchor.web3.PublicKey(
  `2uebyRVefvi2GysvsgHkkRosDYfoa5qJDRZByadai8de`
)

export const TOKEN_MINT = new anchor.web3.PublicKey(
  "4xYbGrvukP9TbqT2c6PjzniX3EHmZgrvknfc5kzH2xAL"
);

export const faucet = new anchor.web3.PublicKey(
  "CAFaKUidizzr3epvHbEY5Zmk6d8jGQTodmNvjHMDBAuG"
);

export interface Props {
  myDonate
  price
  setTransactionUrl
}

export const AirdropInfo: FC<Props> = ({myDonate, price, setTransactionUrl }) => {
  const [myClaim, setMyClaim] = useState(0)
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

    const [USER_PDA] = await anchor.web3.PublicKey.findProgramAddress(
      [faucet.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      const userInfo = await program.account.userInfo.fetch(USER_PDA);
      setMyClaim(userInfo.airdrop.toNumber()/1e9)
    }
    catch(err) {
      console.log(err)
    }
    //console.log(faucetInfo)
    //console.log(userInfo.donate.toNumber()/1e9)
    
  }

  const claim = async (program) => {
    console.log('begin donate')

    const teamAccount = new anchor.web3.PublicKey(
      "8QJt3h5MSHjf8Cy3MdamDgwtBK9RYXP2th7uZjAJHorZ"
    );

    const [USER_PDA] = await anchor.web3.PublicKey.findProgramAddress(
      [faucet.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId
    );

    const [payerAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        spl.TOKEN_PROGRAM_ID.toBuffer(),
        TOKEN_MINT.toBuffer(),
      ],
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [FAUCET_PDA, faucetBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [faucet.toBuffer()],
        program.programId
      );

    const sig = await program.methods
        .payout()
        .accounts({
          faucet: faucet,
          userInfo: USER_PDA,
          payer: wallet.publicKey,
          fromTokenAccount: FAUCET_PDA,
          toTokenAccount: payerAccount,
          tokenMint: TOKEN_MINT,
          systemProgram: anchor.web3.SystemProgram.programId,
          associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        })
      .rpc()

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
  }

  return (
    <VStack>
      <Text color="white">Donate channel is closed</Text>
      <Text color="white">You will get {price} solowb for every solana you donate </Text>
      {
        myClaim > 0 ? ( 
        <Text color="white">You've claimed {myClaim} solowb </Text>
        ) :(
          <VStack>
          {myDonate>0 && (
            <HStack>
              <Button onClick={() => claim(program)}>Claim solowb</Button>
              <Button onClick={() => refreshInfo(program)}>Refresh info</Button>
            </HStack>)
          }
          </VStack>
        )
      }
      
     
    </VStack>
  )
}
