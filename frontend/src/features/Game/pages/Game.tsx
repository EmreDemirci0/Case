// Game.tsx
import  { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import useLogout from "../../../hooks/useLogout";
import EnergyPanel from "./EnergyPanel";
import GameCards from "./GameCards";

function Game() {
  const { token, userId } = useAuth();
  const { logout } = useLogout();
  
  // Sadece component'ler arası iletişim için gerekli state'ler
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Enerji tüketildiğinde EnergyPanel'i yenile
  const handleEnergyConsumed = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-end">
          <button onClick={() => logout(token || "")} className="text-blue-400 text-sm hover:underline">
            Çıkış Yap
          </button>
        </div>

        <EnergyPanel
          token={token}
          refreshTrigger={refreshTrigger} // Key yerine prop olarak gönder
        />

        <GameCards
          token={token}
          userId={userId !== null && userId !== undefined ? String(userId) : null}
          onEnergyConsumed={handleEnergyConsumed}
        />
      </div>
    </div>
  );
}

export default Game;