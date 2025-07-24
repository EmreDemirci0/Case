const infoMessages = {
  emailRequired: "Lütfen bir e-posta adresi giriniz.",
  passwordRequired: "Lütfen bir şifre giriniz.",
  confirmPasswordRequired: "Lütfen şifrenizi tekrar giriniz.",
  passwordsDoNotMatch: "Girdiğiniz şifreler birbiriyle uyuşmuyor.",
  registrationSuccess: "Kayıt işlemi başarıyla tamamlandı. Giriş yapabilirsiniz.",
  emailAlreadyExists: "Bu e-posta adresiyle zaten bir hesap mevcut.",
  unknownError: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  loginEmailNotFound: "Bu e-posta adresine ait bir kullanıcı bulunamadı. Lütfen kayıt olun.",
  invalidPassword: "Parola 5-15 karakter arası, en az 1 büyük harf ve 1 noktalama işareti içermeli.",
  loginPasswordWrong: "Girdiğiniz şifre hatalı. Lütfen tekrar deneyiniz.",
  loginSuccess: "Başarıyla giriş yaptınız. Hoş geldiniz!",
  tokenExpired: "Oturum süreniz doldu. Lütfen yeniden giriş yapınız.",
  logoutSuccess: "Başarıyla çıkış yaptınız. Görüşmek üzere!",
  logoutError: "Çıkış işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
  updateSuccess: "Bilgileriniz başarıyla güncellendi.",
  updateError: "Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyiniz.",
};

const authUiTexts = {
  nameSurnameLabel:"Ad Soyad",
  nameSurnamePlaceholder:"Ad Soyad",
  emailLabel: "E-posta",
  emailPlaceholder: "E-posta Adresi",
  passwordLabel: "Şifre",
  passwordPlaceholder: "Şifreniz",
  confirmPasswordLabel: "Şifre Tekrar",
  confirmPasswordPlaceholder: "Şifrenizi Tekrar girin",
  login: "Giriş Yap",
  register: "Üye Ol",
  alreadyHaveAccount:"Zaten hesabınız var mı?",
  forgotPassword: "Şifreni mi unuttun?",
  noAccountText: "Hesabınız yok mu?",
  registerLink: "Üye Ol",
  copyright:
    "©2020 Y. Emre Demirci. Tüm hakları saklıdır.",
};
const gameUiTexts={
  logout:"Çıkış Yap",
  energy:"Enerji",
  remainingToRenewal1Percent:"%1 Yenilenmesine Kalan",
  allLevels:"Tüm Seviyeler",
  level:"Seviye",
  maxlevel:"Maks. Seviye",
  upgrade:"Yükselt",
  levelUp:"Geliştir",
  levelAbbreviation:"Sv",
  loading:"Yükleniyor...",
  noFilterItem:"Filtreye uygun eşya bulunamadı.",

}

export default { infoMessages,authUiTexts,gameUiTexts };
