// config.ts
import tr from "../i18n/tr";
import en from "../i18n/en";

const locales = { tr, en };

let currentLocale = localStorage.getItem("lang") || "tr"; // varsayılan dil
let locale = locales[currentLocale as keyof typeof locales];

// Aktif locale değiştirici
export const setLocale = (lang: "tr" | "en") => {
  localStorage.setItem("lang", lang);
  currentLocale = lang;
  locale = locales[lang];
};

// Çeviri fonksiyonu
export const t = (key: string) =>
  key.split(".").reduce((obj: any, k: string) => obj?.[k], locale) || key;
