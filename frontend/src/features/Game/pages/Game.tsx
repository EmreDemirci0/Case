import React, { useEffect, useState } from "react";
import { consumeEnergy, fetchAppSettings, fetchEnergy } from "../../Game/services/gameService";
import { useAuth } from "../../../hooks/useAuth";
import useLogout from "../../../hooks/useLogout";

function Game() {
  const { token } = useAuth();
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useLogout();

  // İlk veri yüklemesi: token varsa
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setLoading(true);

        const settingsRes = await fetchAppSettings((token || ""));
        if (settingsRes.data) {
          setMaxEnergy(Number(settingsRes.data.maxEnergy));
          setRegenMinutes(Number(settingsRes.data.regenMinutes));
        }

        const energyRes = await fetchEnergy((token || ""));
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt ));
        }

        setLoading(false);
      } catch (err) {
        setError("Enerji verileri alınamadı.");
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  // Realtime energy + kalan süre hesaplama
  useEffect(() => {
    if (!lastUpdate || !regenMinutes || !maxEnergy) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - new Date(lastUpdate).getTime();
      const regenMs = regenMinutes * 60 * 1000;

      const regenerated = Math.floor(diffMs / regenMs);
      const newEnergy = Math.min(maxEnergy, regenerated);
      setEnergy(newEnergy);

      const timeSinceLast = diffMs % regenMs;
      const timeLeftMs = regenMs - timeSinceLast;
      setSecondsToNextEnergy(Math.floor(timeLeftMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, regenMinutes, maxEnergy]);

  async function handleConsumeEnergy() {
    if (!token) {
      alert("Lütfen giriş yapın.");
      return;
    }

    try {
      const result = await consumeEnergy(token, 1);
      console.log(result);
      if (result.success) {
        const energyRes = await fetchEnergy(token);
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }
      } else {
        alert(result.message);
      }
    } catch {
      alert("Enerji harcama sırasında hata oluştu.");
    }
  }

  function formatSeconds(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  const energyPercent = Math.min(100, (energy / maxEnergy) * 100);

  return (
    
    <div className="mt-4 px-2">
       <button onClick={() => logout(token || "")} className="text-blue-400">
          Logout
        </button>
      <div className="text-sm font-medium text-pink-400">
        {loading
          ? "Enerji yükleniyor..."
          : error
          ? error
          : `Enerji: ${energy} / ${maxEnergy}`}
      </div>
      <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden mt-1">
        <div
          className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
          style={{ width: `${energyPercent}%` }}
        ></div>
        <div className="absolute w-full text-center text-xs text-white leading-5">
          {energy >= maxEnergy
            ? "Enerji Dolu!"
            : secondsToNextEnergy !== null
            ? `1 Enerji Yenilenmesine Kalan: ${formatSeconds(secondsToNextEnergy)}`
            : "1 Enerji Yenilenmesine Kalan: 00:00"}
        </div>
      </div>
      <button
        onClick={handleConsumeEnergy}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
      >
        1 Enerji Harca
      </button>
    </div>
  );
}

export default Game;
