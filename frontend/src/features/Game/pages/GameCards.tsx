// GameCards.tsx
import  { useEffect, useState } from "react";
import {
  fetchItemLevel,
  fetchProgress,
  fetchUserItems,
  increaseProgress,
  fetchLevelUp,
  consumeEnergy,
  fetchEnergy,
  fetchAppSettings,
} from "../../Game/services/gameService";

interface GameCardsProps {
  token: string | null;
  userId: string | null;
  onEnergyConsumed?: () => void;
}
const levelBorders: Record<number, string> = {
    1: "border-[#6CE3CB]", // Seviye 1 - Turkuaz / Açık Yeşil
    2: "border-[#79F076]", // Seviye 2 - Yeşil
    3: "border-[#FFD93D]", // Seviye 3 - Sarı
    4: "border-[#FF7F50]", // Seviye 4 - Turuncu
    5: "border-[#EE39A8]", // Seviye 5 - Pembe / Efsanevi gibi
  };
  const levelSoftShadows: Record<number, string> = {
    1: "shadow-[0_0_12px_2px_rgba(108,227,203,0.2)]",  // turkuaz
    2: "shadow-[0_0_12px_2px_rgba(121,240,118,0.2)]",  // yeşil
    3: "shadow-[0_0_12px_2px_rgba(255,217,61,0.25)]",  // sarı
    4: "shadow-[0_0_12px_2px_rgba(255,127,80,0.25)]",  // turuncu
    5: "shadow-[0_0_14px_3px_rgba(238,57,168,0.35)]",  // pembe
  };
  const levelGlowShadows: Record<number, string> = {
    1: "shadow-[0_0_16px_2px_rgba(108,227,203,0.2)]",  // Turkuaz
    2: "shadow-[0_0_18px_2px_rgba(121,240,118,0.4)]", // Yeşil
    3: "shadow-[0_0_20px_3px_rgba(255,255,0,0.45)]",   // Sarı
    4: "shadow-[0_0_20px_3px_rgba(255,127,80,0.5)]",   // Turuncu
    5: "shadow-[0_0_24px_4px_rgba(238,57,168,0.55)]",  // Pembe
  };

function GameCards({ token, userId, onEnergyConsumed }: GameCardsProps) {
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [maxItemLevel, setMaxItemLevel] = useState(3);

  // Veri çekme
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

  // App settings'den maxItemLevel al
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

  // Progress verilerini yükle
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

  // Enerji harca
  const handleConsumeEnergy = async (): Promise<boolean> => {
    if (!token) {
      alert("Lütfen giriş yapın.");
      return false;
    }
    try {
      const result = await consumeEnergy(token, 1);
      if (result.success) {
        onEnergyConsumed?.(); // Parent'a enerji tüketildiğini bildir
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
      const res = await increaseProgress(token || "", cardId, 2);
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

  // Seviye atla
  const handleLevelUp = async (cardId: number, index: number) => {
    try {
      const res = await fetchLevelUp(token, cardId);

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

      // itemLevels güncelle, backend'den gelen seviye ile
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
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {userItems.length > 0 && itemLevels.length === userItems.length ? (
        userItems.map((itemInstance, i) => {
          const itemLevel = itemLevels[i];
          const progress = progressData[itemInstance.id] || 0;
          const isMaxLevel = itemInstance.currentLevel >= maxItemLevel;
          const isReadyToLevelUp = progress >= 100;
          const showLevelUpButton = isReadyToLevelUp && !isMaxLevel;

          return (
            <div
  key={itemInstance.id}
  className={`relative aspect-[111/92] rounded-2xl overflow-hidden group bg-cover bg-center border border-gray-700 transition-all duration-300
    ${levelGlowShadows[itemInstance.currentLevel] || ""}
  `}
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

                <div className="flex items-center gap-2 mt-2">
                  {isMaxLevel ? (
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
  );
}

export default GameCards;