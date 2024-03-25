import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
      "EN": "EN",
      "funeral": "The funeral of LOWB (on Apr 4)"
    }
  },
  zh: {
    translation: {
      "Welcome to React": "欢迎使用 React 和 react-i18next",
      "EN": "ZH",
      "funeral": "LOWB葬礼（清明节举行）"
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