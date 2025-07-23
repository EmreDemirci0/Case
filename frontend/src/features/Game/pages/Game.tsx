// Game.tsx
import React, { useEffect, useState } from "react";
import {
  consumeEnergy,
  fetchAppSettings,
  fetchEnergy,
  fetchItemLevel,
  fetchProgress,
  fetchUserItems,
  increaseProgress,
  fetchLevelUp,
} from "../../Game/services/gameService";
import { useAuth } from "../../../hooks/useAuth";
import useLogout from "../../../hooks/useLogout";

function Game() {
  const { token, userId } = useAuth();
  const { logout } = useLogout();

  const [energy, setEnergy] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<number, number>>({});

  const energyPercent = Math.min(100, (energy / maxEnergy) * 100);
  const MAX_LEVEL = 3;

  // Veri çekme
  useEffect(() => {
    async function fetchData() {
      if (!token || !userId) return;
      try {
        const userItemsRes = await fetchUserItems(token, userId);
        setUserItems(userItemsRes);

        const itemLevelsRes = await Promise.all(
          userItemsRes.map((itemInstance: any) =>
            fetchItemLevel(token, itemInstance.item.id, itemInstance.currentLevel)
          )
        );
        setItemLevels(itemLevelsRes);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    }
    fetchData();
  }, [token, userId]);

  useEffect(() => {
    if (!token || userItems.length === 0) return;

    async function loadProgresses() {
      const newProgressData: Record<number, number> = {};
      for (const item of userItems) {
        try {
          const res = await fetchProgress(token || "", item.id);
          newProgressData[item.id] = res.progress;
        } catch (e) {
          console.error("Progress alınamadı", e);
        }
      }
      setProgressData(newProgressData);
    }

    loadProgresses();
  }, [token, userItems]);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        setLoading(true);
        const settingsRes = await fetchAppSettings(token || "");
        if (settingsRes.data) {
          setMaxEnergy(Number(settingsRes.data.maxEnergy));
          setRegenMinutes(Number(settingsRes.data.regenMinutes));
        }

        const energyRes = await fetchEnergy(token || "");
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

  // Progress arttır
  const handleIncreaseProgress = async (cardId: number, index: number) => {
    const energyConsumed = await handleConsumeEnergy();
    if (!energyConsumed) return;

    try {
      const res = await increaseProgress(token || "", cardId, 2); // örn %2 arttır
      setProgressData((prev) => ({
        ...prev,
        [cardId]: res.progress,
      }));

      if (res.progress >= 100) {
        await refreshItemLevel(cardId, index);
      }

      console.log(`Progress güncellendi: ${res.progress}%`);
    } catch (e) {
      console.error("Progress artırma hatası:", e);
    }
  };

  // Item level ve açıklama yenile
  const refreshItemLevel = async (cardId: number, index: number) => {
    try {
      const updatedLevel = await fetchItemLevel(token || "", userItems[index].item.id, userItems[index].currentLevel);
      setItemLevels((prev) => {
        const newLevels = [...prev];
        newLevels[index] = updatedLevel;
        return newLevels;
      });
    } catch (e) {
      console.error("Item level yenileme hatası:", e);
    }
  };

  // Seviye atla
  const handleLevelUp = async (cardId: number, index: number) => {
    try {
      const res = await fetchLevelUp(token || "", cardId);

      // userItems güncelle (currentLevel ve progress)
      setUserItems((prev) => {
        const newItems = [...prev];
        newItems[index] = {
          ...newItems[index],
          currentLevel: res.level,
          progress: 0,
        };
        return newItems;
      });

      // itemLevels güncelle, backend’den gelen seviye ile
      const updatedLevel = await fetchItemLevel(token || "", userItems[index].item.id, res.level);
      setItemLevels((prev) => {
        const newLevels = [...prev];
        newLevels[index] = updatedLevel;
        return newLevels;
      });

      // progress sıfırla
      setProgressData((prev) => ({
        ...prev,
        [cardId]: 0,
      }));

      console.log(`Seviye atlandı: ${res.level}`);
    } catch (e: any) {
      alert(`Seviye atlama başarısız: ${e.message || e}`);
      console.error("Seviye atlama hatası:", e);
    }
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-end">
          <button onClick={() => logout(token || "")} className="text-blue-400 text-sm hover:underline">
            Çıkış Yap
          </button>
        </div>

        {/* Enerji Paneli */}
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

        {/* Kartlar */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userItems.length > 0 && itemLevels.length === userItems.length ? (
            userItems.map((itemInstance, i) => {
              const itemLevel = itemLevels[i];
              const progress = progressData[itemInstance.id] || 0;
              const isMaxLevel = itemInstance.currentLevel >= MAX_LEVEL;
              const isReadyToLevelUp = progress >= 100;
              const showLevelUpButton = isReadyToLevelUp && !isMaxLevel;

              return (
                <div
                  key={itemInstance.id}
                  className="relative aspect-[111/92] rounded-2xl overflow-hidden border border-[#353535] shadow-lg group bg-cover bg-center"
                  style={{ backgroundImage: `url(/${itemLevel.imageUrl || "level1.png"})` }}
                >
                  <div
                    className="absolute top-2 right-2 text-white text-[15px] z-10"
                    style={{
                      backgroundColor: "transparent",
                      fontFamily: "Galano Grotesque, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      textAlign: "right",
                      fontVariantNumeric: "lining-nums tabular-nums",
                    }}
                  >
                    Seviye {itemInstance.currentLevel}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 space-y-1 z-10">
                    <h3 className="text-white text-sm font-bold leading-snug">{itemLevel.title}</h3>
                    <p className="text-xs text-gray-300 leading-tight line-clamp-2">{itemLevel.description}</p>

                  {/* Bu kısmı değiştiriyoruz: progress bar ve buton alanı */}
<div className="flex items-center gap-2 mt-2">
  {isMaxLevel ? (
    // Max level ise progress bar gizli, buton tam genişlik
    <button
      disabled
      className="w-full rounded-full h-8 flex items-center justify-center gap-2 bg-gray-600 cursor-not-allowed shadow"
      style={{
        fontFamily: "'Galano Grotesque', sans-serif",
        fontWeight: 600,
        fontStyle: "normal",
        fontSize: "15px",
        lineHeight: "120%",
        color: "#aaa",
      }}
    >
      <img src="/energyIcon.png" alt="Enerji" className="w-7 h-7" /> Max Seviye 
    </button>
  ) : (
    <>
      {/* Progress Bar */}
      <div className="relative w-1/2 h-8 bg-[#2b2b2b] rounded-full overflow-hidden border border-[#444]">
        <div
          className="absolute top-0 left-0 h-full bg-[#EE39A8] shadow-[0_0_12px_4px_rgba(238,57,168,0.6)] transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center text-white text-[13px] font-bold"
          style={{
            fontFamily: "Galano Grotesque, sans-serif",
            fontWeight: 600,
            lineHeight: "120%",
          }}
        >
          %{progress}
        </div>
      </div>

      {/* Buton */}
      <button
        disabled={isMaxLevel}
        className={`w-1/2 rounded-full h-8 flex items-center justify-center gap-2 shadow transition
          ${showLevelUpButton ? "bg-[#EE39A8] text-white" : "bg-[#FDE68A] text-black"}
        `}
        style={{
          fontFamily: "'Galano Grotesque', sans-serif",
          fontWeight: 600,
          fontStyle: "normal",
          fontSize: "15px",
          lineHeight: "120%",
          color: showLevelUpButton ? "white" : "black",
        }}
        onClick={() => {
          if (isMaxLevel) return;
          if (showLevelUpButton) {
            handleLevelUp(itemInstance.id, i);
          } else {
            handleIncreaseProgress(itemInstance.id, i);
          }
        }}
      >
        <span
          style={{ color: showLevelUpButton ? "white" : "#EE39A8" }}
          className="flex items-center gap-1"
        >
          <img src="/energyIcon.png" className="w-7 h-7" alt="Enerji" />
          {showLevelUpButton ? null : `-${itemLevel.energyCost || 1}`}
        </span>
        <span>{showLevelUpButton ? "Yükselt" : "Geliştir"}</span>
      </button>
    </>
  )}
</div>

                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition" />
                </div>
              );
            })
          ) : (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#2b2b2b] aspect-[111/92] rounded-xl border border-gray-700 flex items-center justify-center text-gray-500"
              >
                Yükleniyor...
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
