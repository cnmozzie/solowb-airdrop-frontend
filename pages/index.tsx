import { NextPage } from "next"
import styles from "../styles/Home.module.css"
import { AppBar } from "../components/AppBar"
import { useWallet } from "@solana/wallet-adapter-react"
import { AirdropInfo } from "../components/AirdropInfo"
import { useState } from "react"
import Head from "next/head"
import { useTranslation } from 'react-i18next';
import '../i18n';
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';

const Home: NextPage = (props) => {
  const [myDonate, setMyDonate] = useState(0)
  const [price, setPrice] = useState("")
  const [transactionUrl, setTransactionUrl] = useState("")
  const wallet = useWallet()

  const { t, i18n } = useTranslation();

  return (
    <div className={styles.App}>
      <Head>
        <title>The funeral of LOWB</title>
      </Head>
      <Box h="calc(10vh)" w="full">
        <Stack w="full" h="calc(10vh)">
          <AppBar />

        </Stack>
      </Box>
      <div className="container mx-auto">
        
      <div>
            
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
              <h1 className="text-3xl font-bold text-white">Connect Wallet to see how many people joined this funeral!</h1>
            )}
            <Spacer />
            {transactionUrl && (
              <Link href={transactionUrl} color="white" isExternal margin={8}>
                View most recent transaction
              </Link>
            )}
          </div>


        <br/><br/><br/>
  <div className="md:flex">
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold text-white">Introduction</h1>
    </div>
    <div className="md:w-1/2 text-white text-lg">
      <p>Lowb Ash, a unique token of remembrance, is a poignant tribute to the now departed Loser Coin (Lowb) project. It serves as a tangible manifestation of our collective memory, our shared journey, and our unwavering commitment to the principles that Lowb stood for.</p>
            <p>This token is not just a digital asset, it is a symbol of resilience and perseverance. Each Lowb Ash is a testament to the struggles we faced, the challenges we overcame, and the spirit of never giving up that we embodied throughout the journey of the Lowb project.</p>
            <p>Lowb Ash is designed to be a lasting reminder of the project&apos;s legacy. It encapsulates the essence of the Loser Coin and is a beacon of its enduring spirit. It stands as a token of our collective strength, our shared dreams, and our commitment to continue the journey, no matter what the future holds.</p>
            <p>By holding Lowb Ash, you are not just holding a piece of history, but also a promise for the future. A promise to carry forward the spirit of Lowb, to face challenges head-on, to never fear failure, and to continue to strive for success in the ever-evolving world of cryptocurrency.</p>
            <p>Let Lowb Ash serve as a reminder that even in the face of failure, there is always a way forward. Let it remind us that the spirit of Lowb will always live on, in our hearts, in our actions, and in our relentless pursuit of our dreams.</p>
    </div>
  </div>

  <br/><br/><br/>
  <div className="md:flex">
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold text-white">简介</h1>
    </div>
    <div className="md:w-1/2 text-white text-lg">
    <p>Lowb Ash，这个独特的纪念代币，是对已经离我们而去的Loser Coin (Lowb)项目的深情致敬。它是我们集体记忆、共享旅程和我们对Lowb所代表的原则坚定承诺的具象化。</p>
            <p>这个代币不仅仅是一个数字资产，它是坚韧和毅力的象征。每一个Lowb Ash都见证了我们面对的挑战，我们克服的困难，以及我们在整个Lowb项目旅程中所体现的永不放弃的精神。</p>
            <p>Lowb Ash旨在成为项目遗产的持久提醒。它封装了Loser Coin的精髓，是其持久精神的灯塔。它象征着我们的集体力量，我们的共享梦想，以及我们无论未来如何，都要继续前行的承诺。</p>
            <p>持有Lowb Ash，你不仅是持有一段历史，也是对未来的承诺。一个承诺，将Lowb的精神传承下去，直面挑战，不惧失败，继续在不断变化的加密货币世界中追求成功。</p>
            <p>让Lowb Ash提醒我们，即使面临失败，总有一条前行的道路。让它提醒我们，Lowb的精神将永远在我们的心中、在我们的行动中、在我们对梦想的不懈追求中活下去。</p>
    </div>
  </div>

  <br/><br/><br/>
  <div className="md:flex">
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold text-white">Find more info here</h1>
    </div>
    <div className="md:w-1/2 text-white text-lg">
      <a href="https://x.com/ASHofLOWB">
      <FontAwesomeIcon size="3x" color="white" icon={faTwitter} /> {/* Render the coffee icon */}
      </a>
      <a href="https://t.me/ASHofLOWB">
      <FontAwesomeIcon size="3x" color="white" icon={faTelegram} /> {/* Render the home icon */}
      </a>
    </div>
    </div>
  </div>
  <br/><br/><br/>

  </div>
  )
}

export default Home
