// LoginForm.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { t as localize, ROUTES } from "../../../config";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../../../hooks/useDarkMode";
import { sendLoginRequest } from "../services/authService";
import { useNotification } from "../../../components/common/NotificationContext";

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const { setNotificationMessage } = useNotification();
  useEffect(() => {
    document.title = localize("authUiTexts.login");
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!email) {
      setEmailError(localize("infoMessages.emailRequired"));
      hasError = true;
    }
    if (!password) {
      setPasswordError(localize("infoMessages.passwordRequired"));
      hasError = true;
    }
    if (hasError) return;
    try {
      const response = await sendLoginRequest(email, password);
      if (response.data) {
        if (response != null && response.success === true) {
          //* Success
          localStorage.setItem("token", response.data.token);
          setNotificationMessage(localize("infoMessages.loginSuccess"), "green");
          navigate(ROUTES.GAME);
        } else {
          setPassword("");
          if (response.data.errorType === "email") {
            setEmailError(localize("infoMessages.loginEmailNotFound"));
            setPasswordError("");
          } else if (response.data.errorType === "password") {
            setPasswordError(localize("infoMessages.loginPasswordWrong"));
            setEmailError("");
          } else {
            setPasswordError(localize("infoMessages.unknownError"));
            setEmailError("");
          }
        }
      }
    } catch {
      setPasswordError(localize("infoMessages.unknownError"));
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
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" stroke="currentColor" />
              <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-main-white dark:text-main-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
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
                htmlFor="email"
              >
                {localize("authUiTexts.emailLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline ${emailError ? "border-red-500" : ""
                  } dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="email"
                type="email"
                placeholder={localize("authUiTexts.emailPlaceholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) {
                    setEmailError("");
                  }
                }}
              />
              {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-main-white dark:text-main-black text-sm font-bold mb-2"
                htmlFor="password"
              >
                {localize("authUiTexts.passwordLabel")}
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline${passwordError ? " border-red-500" : ""
                  } dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-700`}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="******************"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) {
                    setPasswordError("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 dark:text-gray-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.05 10.05 0 0112 20c-5 0-9-3-10-8 1-3 4-6 10-6 1.91 0 3.68.63 5.06 1.7" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
            </div>
            <button
              className="bg-surface-green-light dark:bg-surface-green-dark hover:bg-surface-green-light-hover dark:hover:bg-surface-green-dark-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              type="submit"
            >
              {localize("authUiTexts.login")}
            </button>
            <div className="text-center mb-2">
              <a className="text-main-light dark:text-main-dark text-sm block" href="#">
                {localize("authUiTexts.forgotPassword")}
              </a>
            </div>
            <div className="text-center mb-4">
              <span className="text-main-light dark:text-main-dark text-sm">
                {localize("authUiTexts.noAccountText")}{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-bold text-main-light dark:text-main-dark hover:text-main-green-light-hover dark:hover:text-main-green-dark-hover"
                >
                  {localize("authUiTexts.registerLink")}
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
