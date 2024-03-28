import { FC, ReactNode, useMemo } from "react"
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import * as web3 from "@solana/web3.js"
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets"
require("@solana/wallet-adapter-react-ui/styles.css")



const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const QUIKNODE_KEY = process.env.NEXT_PUBLIC_QUIKNODE_KEY;
  const endpoint = `https://blissful-nameless-emerald.solana-mainnet.quiknode.pro/${QUIKNODE_KEY}/`
  //console.log(endpoint)
  const wallets = useMemo(() => {
    return [
      new walletAdapterWallets.PhantomWalletAdapter(),
      new walletAdapterWallets.SolflareWalletAdapter(),
    ]
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
