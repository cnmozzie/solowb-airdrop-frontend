import { NextPage } from "next"
import styles from "../styles/Home.module.css"
import { AppBar } from "../components/AppBar"
import { useWallet } from "@solana/wallet-adapter-react"
import { AirdropInfo } from "../components/AirdropInfo"
import { useState } from "react"
import Head from "next/head"
import {
  Spacer,
  VStack,
  Text,
  Button,
  Box,
  Stack,
  Link,
} from "@chakra-ui/react"
import { DonateInfo } from "../components/DonateInfo"

const Home: NextPage = (props) => {
  const [myDonate, setMyDonate] = useState(0)
  const [price, setPrice] = useState("")
  const [transactionUrl, setTransactionUrl] = useState("")
  const wallet = useWallet()

  return (
    <div className={styles.App}>
      <Head>
        <title>Anchor Frontend Example</title>
      </Head>
      <Box h="calc(100vh)" w="full">
        <Stack w="full" h="calc(100vh)" justify="center">
          <AppBar />
          
          <div className={styles.AppBody}>
            <Text color="white">Make Losers Great Again!</Text>
            <Spacer />
            {wallet.connected ? (
              <VStack>
                <DonateInfo
                  myDonate={myDonate}
                  setMyDonate={setMyDonate}
                  price={price}
                  setPrice={setPrice}
                  setTransactionUrl={setTransactionUrl}
                />
                <Spacer />
                {price && (
                  <AirdropInfo 
                  myDonate={myDonate}
                  price={price}  
                  setTransactionUrl={setTransactionUrl}
                  />
                )}
              </VStack>
            ) : (
              <Text color="white">Connect Wallet</Text>
            )}
            <Spacer />
            {transactionUrl && (
              <Link href={transactionUrl} color="white" isExternal margin={8}>
                View most recent transaction
              </Link>
            )}
          </div>
        </Stack>
      </Box>
    </div>
  )
}

export default Home
