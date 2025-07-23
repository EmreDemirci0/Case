// EnergyPanel.tsx
import React, { useEffect, useState } from "react";
import { consumeEnergy, fetchAppSettings, fetchEnergy } from "../../Game/services/gameService";

interface EnergyPanelProps {
  token: string | null;
  onEnergyUpdate?: (energy: number, lastUpdate: Date) => void;
  refreshTrigger?: number; // Dışarıdan gelen refresh tetikleyicisi
}

function EnergyPanel({ token, onEnergyUpdate, refreshTrigger }: EnergyPanelProps) {
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const energyPercent = Math.min(100, (energy / maxEnergy) * 100);

  // Dışarıdan gelen refresh tetikleyicisini dinle
  useEffect(() => {
    if (!token || !refreshTrigger) return;

    async function refreshEnergy() {
      try {
        const energyRes = await fetchEnergy(token);
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }
      } catch (err) {
        console.error("Enerji yenilenirken hata:", err);
      }
    }

    refreshEnergy();
  }, [refreshTrigger, token]);

  // Enerji verilerini yükle
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setLoading(true);
        const settingsRes = await fetchAppSettings(token);
        if (settingsRes.data) {
          setMaxEnergy(Number(settingsRes.data.maxEnergy));
          setRegenMinutes(Number(settingsRes.data.regenMinutes));
        }

        const energyRes = await fetchEnergy(token);
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }

        setLoading(false);
      } catch {
        setError("Enerji verileri alınamadı.");
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  // Enerji regeneration timer
  useEffect(() => {
    if (!lastUpdate || !regenMinutes || !maxEnergy) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const regenMs = regenMinutes * 60 * 1000;
      const regenerated = Math.floor(diffMs / regenMs);
      const newEnergy = Math.min(maxEnergy, regenerated);
      setEnergy(newEnergy);

      const timeLeftMs = regenMs - (diffMs % regenMs);
      setSecondsToNextEnergy(Math.floor(timeLeftMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, regenMinutes, maxEnergy]);

  // Enerji güncellemelerini parent'a bildir
  useEffect(() => {
    if (onEnergyUpdate && lastUpdate) {
      onEnergyUpdate(energy, lastUpdate);
    }
  }, [energy, lastUpdate, onEnergyUpdate]);

  // Enerji harca
  const handleConsumeEnergy = async (): Promise<boolean> => {
    if (!token) {
      alert("Lütfen giriş yapın.");
      return false;
    }
    try {
      const result = await consumeEnergy(token, 1);
      if (result.success) {
        const energyRes = await fetchEnergy(token);
        if (energyRes.data) {
          setEnergy(energyRes.data.energy);
          setLastUpdate(new Date(energyRes.data.lastEnergyUpdateAt));
        }
        return true;
      } else {
        alert(result.message);
        return false;
      }
    } catch {
      alert("Enerji harcama sırasında hata oluştu.");
      return false;
    }
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="bg-[#1f1f1f] p-4 rounded-xl shadow-md space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/energyIcon.png" alt="Enerji" className="w-10 h-10" />
          <span className="text-sm font-semibold">Enerji</span>
        </div>
        <span className="text-xs text-pink-400 font-medium">
          %{Math.floor(energyPercent)} ({energy}/{maxEnergy})
        </span>
      </div>

      <div className="relative h-4 bg-[#333] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
          style={{ width: `${energyPercent}%` }}
        />
        <div className="absolute w-full text-center text-[11px] text-white font-medium">
          {loading
            ? "Yükleniyor..."
            : error
              ? error
              : energy >= maxEnergy
                ? "Enerji Dolu!"
                : secondsToNextEnergy !== null
                  ? `1 Yenilenmesine Kalan: ${formatSeconds(secondsToNextEnergy)}`
                  : ""}
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={handleConsumeEnergy}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm rounded-lg transition"
        >
          1 Enerji Harca (Test)
        </button>
      </div>
    </div>
  );
}

export default EnergyPanel;