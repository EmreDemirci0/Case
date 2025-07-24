import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { t as localize, ROUTES } from "../../../config";
import useDarkMode from "../../../hooks/useDarkMode";
import { sendRegisterRequest } from "../services/authService";
import { useNotification } from "../../../components/common/NotificationContext";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setNotificationMessage } = useNotification();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  useEffect(() => {
    document.title = localize("authUiTexts.register");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError(localize("infoMessages.emailRequired"));
      hasError = true;
    }
    if (!password) {
      setPasswordError(localize("infoMessages.passwordRequired"));
      hasError = true;
    }
    if (!confirmPassword) {
      setConfirmPasswordError(localize("infoMessages.confirmPasswordRequired"));
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError(localize("infoMessages.passwordsDoNotMatch"));
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await sendRegisterRequest(fullName, email, password);
      if (response.success) {
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setNotificationMessage(localize("infoMessages.registrationSuccess"), "green");
        navigate(ROUTES.LOGIN);
      } else {
        if (response.data.result) {
          if (response.data.result == "invalid_password") {
            setPasswordError(localize("infoMessages.invalidPassword"));
            setEmailError("");
            setConfirmPasswordError("");
          }
          else if (response.data.result == "email_exists") {
            setEmailError(localize("infoMessages.emailAlreadyExists"));
            setPasswordError("");
            setConfirmPasswordError("");
          }
        }
        else {

        }


      }
    } catch {
      setNotificationMessage(localize("infoMessages.unknownError"), "red");
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-surface-white dark:bg-surface-black`}>
      <div className="flex justify-end p-4">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-light dark:hover:bg-surface-dark transition"
          onClick={toggleDarkMode}
          aria-label="Tema Değiştir"
        >
          {darkMode ? (
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" stroke="currentColor" />
              <path
                strokeLinecap="round"
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-main-white dark:text-main-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-surface-dark shadow-2xl rounded px-12 pt-8 pb-10 mb-4"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-main-white dark:text-main-black text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                {localize("authUiTexts.nameSurnameLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="fullName"
                type="text"
                placeholder={localize("authUiTexts.nameSurnamePlaceholder")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-main-white dark:text-main-black text-sm font-bold mb-2"
                htmlFor="email"
              >
                {localize("authUiTexts.emailLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline${emailError ? " border-red-500" : ""} dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="email"
                type="email"
                placeholder={localize("authUiTexts.emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
            </div>

            <div className="mb-4">
              <label
                className="block text-main-white dark:text-main-black text-sm font-bold mb-2"
                htmlFor="password"
              >
                {localize("authUiTexts.passwordLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline${passwordError ? " border-red-500" : ""} dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="password"
                type="password"
                placeholder={localize("authUiTexts.passwordPlaceholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
            </div>

            <div className="mb-6">
              <label
                className="block text-main-white dark:text-main-black text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                {localize("authUiTexts.confirmPasswordLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline${confirmPasswordError ? " border-red-500" : ""} dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="confirmPassword"
                type="password"
                placeholder={localize("authUiTexts.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
              />
              {confirmPasswordError && (
                <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>
              )}
            </div>

            <button
              className="bg-surface-green-light dark:bg-surface-green-dark hover:bg-surface-green-light-hover dark:hover:bg-surface-green-dark-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
            >
              {localize("authUiTexts.register")}
            </button>

            <div className="text-center mb-4">
              <span className="text-main-light dark:text-main-dark text-sm">
                {localize("authUiTexts.alreadyHaveAccount")}{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-bold text-main-light dark:text-main-dark hover:text-main-green-light-hover dark:hover:text-main-green-dark-hover"
                >
                  {localize("authUiTexts.login")}
                </Link>
              </span>
            </div>

          </form>
          <p className="text-center text-gray-500 text-xs"> {localize("authUiTexts.copyright")}</p>
        </div>
      </div>
    </div>
  );
}
