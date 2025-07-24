import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { t as translate, setLocale } from "../../../config";
import useLogout from "../../../hooks/useLogout";
import EnergyPanel from "./EnergyPanel";
import GameCards from "./GameCards";
import useDarkMode from "../../../hooks/useDarkMode";

function Game() {
  const { token, userId } = useAuth();
  const { logout } = useLogout();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "tr");
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    setLocale(language as "tr" | "en");
    forceUpdate((n) => n + 1);
  }, [language]);

  const t = translate;

  const handleEnergyConsumed = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEnergyUpdate = (energy: number) => {
    setCurrentEnergy(energy);
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "tr" ? "en" : "tr"));
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100 text-black dark:bg-[#1a1a1a] dark:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => logout(token)}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            {t("gameUiTexts.logout")}
          </button>

          <div className="flex items-center gap-2">
            {/* 🌐 Dil Değiştirici (Bayrak Butonu) */}
            <button
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 hover:ring-2 ring-blue-400 transition"
              aria-label="Dili değiştir"
              title={language === "tr" ? "Switch to English" : "Türkçeye geç"}
            >
              <img
                src={language === "tr" ? "https://hatscripts.github.io/circle-flags/flags/tr.svg" : "https://hatscripts.github.io/circle-flags/flags/gb.svg"}
                alt={language === "tr" ? "Türkçe" : "English"}
                className="w-full h-full object-cover"
              />
            </button>

            {/* 🌙 Tema Butonu */}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={toggleDarkMode}
              aria-label="Tema Değiştir"
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" />
                  <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <EnergyPanel
          token={token}
          refreshTrigger={refreshTrigger}
          onEnergyUpdate={handleEnergyUpdate}
        />

        <GameCards
          token={token}
          userId={userId !== null && userId !== undefined ? String(userId) : null}
          onEnergyConsumed={handleEnergyConsumed}
          currentEnergy={currentEnergy}
        />
      </div>
    </div>
  );
}

export default Game;
