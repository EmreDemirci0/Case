import { useEffect, useState } from "react";
import { fetchAppSettings, fetchEnergy } from "../../Game/services/gameService";
import { t as localize } from "../../../config";
interface EnergyPanelProps {
  token: string | null;
  onEnergyUpdate?: (energy: number, lastUpdate: Date) => void;
  refreshTrigger?: number;
}

function EnergyPanel({ token, onEnergyUpdate, refreshTrigger }: EnergyPanelProps) {
  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const energyPercent = Math.min(100, (energy / maxEnergy) * 100);

  useEffect(() => {
    if (!token || !refreshTrigger) return;

    async function refreshEnergy() {
      try {
        const energyRes = await fetchEnergy(token);
        if (energyRes) {
          setEnergy(energyRes.energy);
          setLastUpdate(new Date(energyRes.lastEnergyUpdateAt));
        }
      } catch (err) {
        console.error("Enerji yenilenirken hata:", err);
      }
    }

    refreshEnergy();
  }, [refreshTrigger, token]);

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
        if (energyRes) {
          setEnergy(energyRes.energy);
          setLastUpdate(new Date(energyRes.lastEnergyUpdateAt));
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

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

  useEffect(() => {
    if (onEnergyUpdate && lastUpdate) {
      onEnergyUpdate(energy, lastUpdate);
    }
  }, [energy, lastUpdate, onEnergyUpdate]);

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="w-full px-4 pb-2">
      <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-xl shadow-md p-4 text-black dark:text-white">
        <div className="flex items-center gap-2 mb-3">
          <img
            src="/energyIcon.png"
            alt="Enerji"
            className="w-10 h-10 drop-shadow-[0_0_8px_#f472b6]"
          />
          <span className="text-dark dark:text-yellow-300 font-bold text-lg">
             {localize("gameUiTexts.energy")}
             </span>
          <span className="ml-auto text-[11px] min-[400px]:text-sm text-gray-500 dark:text-gray-400">
            {loading || energy >= maxEnergy
              ? ""
              : secondsToNextEnergy !== null
                ? `${localize("gameUiTexts.remainingToRenewal1Percent")} ${formatSeconds(secondsToNextEnergy)}`
                : ""}
          </span>
        </div>
  
        <div className="relative h-6 bg-gray-300 dark:bg-[#3a3a3a] rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute top-0 left-0 h-full bg-pink-300 dark:bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] transition-all duration-500"
            style={{ width: `${energyPercent}%` }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-dark dark:text-pink-100">
            %{Math.floor(energyPercent)}
          </span>
        </div>
      </div>
    </div>
  );
  
}

export default EnergyPanel;
