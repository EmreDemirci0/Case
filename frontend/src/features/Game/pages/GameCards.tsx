import { useEffect, useState } from "react";
import {
  fetchItemLevel,
  fetchProgress,
  fetchUserItems,
  increaseProgress,
  fetchLevelUp,
  consumeEnergy,
  fetchAppSettings,
} from "../../Game/services/gameService";

interface GameCardsProps {
  token: string | null;
  userId: string | null;
  onEnergyConsumed?: () => void;
}

const levelGlowShadows: Record<number, string> = {
  1: "shadow-[0_0_16px_2px_rgba(108,227,203,0.2)]",
  2: "shadow-[0_0_18px_2px_rgba(121,240,118,0.4)]",
  3: "shadow-[0_0_20px_3px_rgba(255,255,0,0.45)]",
  4: "shadow-[0_0_20px_3px_rgba(255,127,80,0.5)]",
  5: "shadow-[0_0_24px_4px_rgba(238,57,168,0.55)]",
};

function GameCards({ token, userId, onEnergyConsumed }: GameCardsProps) {
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [maxItemLevel, setMaxItemLevel] = useState(3);
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");

  useEffect(() => {
    async function fetchData() {
      if (!token || !userId) return;
      try {
        const userItemsRes = await fetchUserItems(token, Number(userId));
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
    if (!token) return;
    async function loadSettings() {
      try {
        const settingsRes = await fetchAppSettings(token);
        if (settingsRes.data) {
          setMaxItemLevel(Number(settingsRes.data.maxItemLevel));
        }
      } catch (err) {
        console.error("Settings yüklenemedi:", err);
      }
    }
    loadSettings();
  }, [token]);

  useEffect(() => {
    if (!token || userItems.length === 0) return;
    async function loadProgresses() {
      const newProgressData: Record<number, number> = {};
      for (const item of userItems) {
        try {
          const res = await fetchProgress(token, item.id);
          newProgressData[item.id] = res.progress;
        } catch (e) {
          console.error("Progress alınamadı", e);
        }
      }
      setProgressData(newProgressData);
    }
    loadProgresses();
  }, [token, userItems]);

  const handleConsumeEnergy = async (): Promise<boolean> => {
    if (!token) {
      alert("Lütfen giriş yapın.");
      return false;
    }
    try {
      const result = await consumeEnergy(token, 1);
      if (result.success) {
        onEnergyConsumed?.();
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

  const handleIncreaseProgress = async (cardId: number) => {
    const energyConsumed = await handleConsumeEnergy();
    if (!energyConsumed) return;

    try {
      const res = await increaseProgress(token || "", cardId, 2);
      setProgressData((prev) => ({ ...prev, [cardId]: res.progress }));
    } catch (e) {
      console.error("Progress artırma hatası:", e);
    }
  };

  const refreshItemLevel = async (index: number) => {
    try {
      const updatedLevel = await fetchItemLevel(token, userItems[index].item.id, userItems[index].currentLevel);
      setItemLevels((prev) => {
        const newLevels = [...prev];
        newLevels[index] = updatedLevel;
        return newLevels;
      });
    } catch (e) {
      console.error("Item level yenileme hatası:", e);
    }
  };

  const handleLevelUp = async (cardId: number, index: number) => {
    try {
      const res = await fetchLevelUp(token, cardId);
      setUserItems((prev) => {
        const newItems = [...prev];
        newItems[index] = {
          ...newItems[index],
          currentLevel: res.level,
          progress: 0,
        };
        return newItems;
      });

      const updatedLevel = await fetchItemLevel(token || "", userItems[index].item.id, res.level);
      setItemLevels((prev) => {
        const newLevels = [...prev];
        newLevels[index] = updatedLevel;
        return newLevels;
      });

      setProgressData((prev) => ({ ...prev, [cardId]: 0 }));
    } catch (e: any) {
      alert(`Seviye atlama başarısız: ${e.message || e}`);
      console.error("Seviye atlama hatası:", e);
    }
  };

  const filteredItems =
    levelFilter === "all" ? userItems : userItems.filter((item) => item.currentLevel === levelFilter);

    return (
      <div className="w-full">
        {/* Filter Panel */}
        <div className="flex justify-center gap-2 mb-6 p-2 bg-[#1e1e1e] rounded-full border border-gray-500">
          <button
            onClick={() => setLevelFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              levelFilter === "all" ? "bg-[#FDE68A] text-black" : "text-gray-400"
            }`}
          >
            Tüm Seviyeler
          </button>
          {[...Array(maxItemLevel)].map((_, i) => {
            const level = i + 1;
            return (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  levelFilter === level ? "bg-[#FDE68A] text-black" : "text-gray-400"
                }`}
              >
                Sv{level}
              </button>
            );
          })}
        </div>
    
        {/* Item Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemLevels.length !== userItems.length ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#2b2b2b] aspect-[111/92] rounded-xl border border-gray-700 flex items-center justify-center text-gray-500"
              >
                Yükleniyor...
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 font-semibold text-sm py-8">
              Filtreye uygun eşya bulunamadı.
            </div>
          ) : (
            filteredItems.map((itemInstance, i) => {
              const globalIndex = userItems.findIndex((u) => u.id === itemInstance.id);
              const itemLevel = itemLevels[globalIndex];
              const progress = progressData[itemInstance.id] || 0;
              const isMaxLevel = itemInstance.currentLevel >= maxItemLevel;
              const isReadyToLevelUp = progress >= 100;
              const showLevelUpButton = isReadyToLevelUp && !isMaxLevel;
    
              return (
                <div
                  key={itemInstance.id}
                  className={`relative aspect-[111/92] rounded-2xl overflow-hidden group bg-cover bg-center border border-gray-700 transition-all duration-300 ${
                    levelGlowShadows[itemInstance.currentLevel] || ""
                  }`}
                  style={{ backgroundImage: `url(/${itemLevel.imageUrl || "level1.png"})` }}
                >
                  <div className="absolute top-2 right-2 text-white text-[15px] z-10 font-bold">
                    Seviye {itemInstance.currentLevel}
                  </div>
    
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 space-y-1 z-10">
                    <h3 className="text-white text-sm font-bold leading-snug">{itemLevel.title}</h3>
                    <p className="text-xs text-gray-300 leading-tight line-clamp-2">{itemLevel.description}</p>
    
                    <div className="flex items-center gap-2 mt-2">
                      {isMaxLevel ? (
                        <button
                          disabled
                          className="w-full rounded-full h-8 flex items-center justify-center gap-2 bg-gray-600 cursor-not-allowed shadow text-[#aaa]"
                        >
                          <img src="/energyIcon.png" alt="Enerji" className="w-7 h-7" /> Max Seviye
                        </button>
                      ) : (
                        <>
                          <div className="relative w-1/2 h-8 bg-[#2b2b2b] rounded-full overflow-hidden border border-[#444]">
                            <div
                              className="absolute top-0 left-0 h-full bg-[#EE39A8] transition-all duration-500 ease-in-out"
                              style={{ width: `${progress}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-white text-[13px] font-bold">
                              %{progress}
                            </div>
                          </div>
    
                          <button
                            className={`w-1/2 rounded-full h-8 flex items-center justify-center gap-2 shadow transition ${
                              showLevelUpButton ? "bg-[#EE39A8] text-white" : "bg-[#FDE68A] text-black"
                            }`}
                            onClick={() => {
                              if (showLevelUpButton) {
                                handleLevelUp(itemInstance.id, globalIndex);
                              } else {
                                handleIncreaseProgress(itemInstance.id);
                              }
                            }}
                          >
                            <span className="flex items-center gap-1">
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
          )}
        </div>
      </div>
    );
    
}

export default GameCards;