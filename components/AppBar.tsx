import { FC, useState } from "react"
import styles from "../styles/Home.module.css"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Image from "next/image"
import '../i18n';
import { useTranslation } from 'react-i18next';

export const AppBar: FC = () => {
  
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState('en');

  const handleLanguageChange = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
    i18n.changeLanguage(language);
  };

  return (
    <header className="bg-gray-800 text-white">
  <div className="container flex justify-between items-center mx-auto px-1 py-2">
    <div className="hidden md:block">
      <a href="#">
        <img src="/solanaLogo.png" alt="Your Logo" className="w-80 h-12" />
      </a>
    </div>
    <h1 className="text-xl font-bold px-1">{t('funeral')}</h1>
    <div className="flex items-center">
      <button className="bg-white text-gray-800 px-2 py-1 rounded-md shadow-sm" onClick={handleLanguageChange}>
        {t('EN')}
      </button>
      <div className="pl-5 py-1">
        <WalletMultiButton />
      </div>
    </div>
  </div>
</header>
    //<div className={styles.AppHeader}>
    //  <Image src="/solanaLogo.png" height={30} width={200} />
    //  <span>The funeral of LOWB (LOWB葬礼，预计于清明节举办)</span>
    //  <WalletMultiButton />
    //</div>
  )
}
