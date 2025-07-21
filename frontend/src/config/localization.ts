import tr from "../i18n/tr";
// import en from "../locales/en";

// Aktif locale'i seç
const locale = tr;

// Çeviri fonksiyonu
export const t = (key: string) =>
    key.split('.').reduce((obj: any, k: string) => obj?.[k], locale) || key; 