const infoMessages = {
  emailRequired: "Please enter an email address.",
  passwordRequired: "Please enter a password.",
  confirmPasswordRequired: "Please confirm your password.",
  passwordsDoNotMatch: "The passwords you entered do not match.",
  registrationSuccess: "Registration completed successfully. You can now log in.",
  emailAlreadyExists: "An account with this email address already exists.",
  unknownError: "An unexpected error occurred. Please try again later.",
  loginEmailNotFound: "No user found with this email address. Please register.",
  invalidPassword: "Password must be 5–15 characters long, include at least one uppercase letter and one punctuation mark.",
  loginPasswordWrong: "The password you entered is incorrect. Please try again.",
  loginSuccess: "Successfully logged in. Welcome!",
  tokenExpired: "Your session has expired. Please log in again.",
  logoutSuccess: "Successfully logged out. See you again!",
  logoutError: "An error occurred during logout. Please try again.",
  updateSuccess: "Your information has been successfully updated.",
  updateError: "An error occurred while updating. Please try again.",
};

const authUiTexts = {
  nameSurnameLabel: "Full Name",
  nameSurnamePlaceholder: "Full Name",
  emailLabel: "Email",
  emailPlaceholder: "Email Address",
  passwordLabel: "Password",
  passwordPlaceholder: "Your Password",
  confirmPasswordLabel: "Confirm Password",
  confirmPasswordPlaceholder: "Re-enter Your Password",
  login: "Log In",
  register: "Sign Up",
  alreadyHaveAccount: "Already have an account?",
  forgotPassword: "Forgot your password?",
  noAccountText: "Don't have an account?",
  registerLink: "Sign Up",
  copyright: "©2020 Y. Emre Demirci. All rights reserved.",
};

const gameUiTexts = {
  logout: "Logout",
  energy: "Energy",
  remainingToRenewal1Percent: "Remaining to reach 1% Renewal",
  allLevels: "All Levels",
  level: "Level",
  maxlevel: "Max Level",
  upgrade: "Upgrade",
  levelUp: "Level Up",
  levelAbbreviation: "Lv",
  loading: "Loading...",
  noFilterItem: "No items found matching the filter.",
};

export default { infoMessages, authUiTexts, gameUiTexts };
