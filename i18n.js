import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Activity1": "Activity #1: Donate to the funeral and get $ASH",
      "Activity2": "Activity: Share the funeral Activity to get POINTS",
      "share on Twitter": "share on Twitter",
      "Donate Now!": "Donate Now!",
      "我捐赠了": "I donated ",
      "支持葬礼仪式": " sol for lowb funeral. Join with me on Apr 4 to get airdrops of $ASH. @ASHofLOWB #SolanaPresale ",
      "EN": "EN",
      "funeral": "The funeral of LOWB (on Apr 4)",
      "开放空投": "You can go back to this page to claim the airdrops right after the funeral."
    }
  },
  zh: {
    translation: {
      "Activity1": "活动1：捐赠丧葬用品。获取$ASH空投",
      "Activity2": "最新活动：分享葬礼活动，获得社区点数",
      "share on Twitter": "一键分享到Twitter",
      "Donate Now!": "立即捐赠",
      "我捐赠了": "我捐赠了",
      "支持葬礼仪式": "个sol支持葬礼仪式，快来和我一起在清明节参与lowb的葬礼吧。 @ASHofLOWB #SolanaPresale ",
      "EN": "ZH",
      "funeral": "LOWB葬礼（清明节举行）",
      "开放空投": "空投通道将于清明节当天开启，别忘了回到这个页面领取$ASH空投"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: "fr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    detection: {
        // 启用浏览器语言检测
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        // 缓存检测结果
        caches: ['cookie', 'localStorage'],
        // 从 URL 查询参数中获取语言
        lookupQuerystring: 'lng',
        // 从 cookie 中获取语言
        lookupCookie: 'i18next',
        // 从 localStorage 中获取语言
        lookupLocalStorage: 'i18nextLng',
    },

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });


  export default i18n;