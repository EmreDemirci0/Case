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
  currentEnergy: number; // Yeni prop eklendi
}

const levelGlowShadows: Record<number, string> = {
  1: "shadow-[0_0_16px_2px_rgba(108,227,203,0.2)]",
  2: "shadow-[0_0_18px_2px_rgba(121,240,118,0.4)]",
  3: "shadow-[0_0_20px_3px_rgba(255,255,0,0.45)]",
  4: "shadow-[0_0_20px_3px_rgba(255,127,80,0.5)]",
  5: "shadow-[0_0_24px_4px_rgba(238,57,168,0.55)]",
};

const energyOptions = [1,2, 5, 10, 20];

function GameCards({ token, userId, onEnergyConsumed, currentEnergy }: GameCardsProps) {
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemLevels, setItemLevels] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [maxItemLevel, setMaxItemLevel] = useState(3);
  const [progressPerEnergy, setprogressPerEnergy] = useState(2);
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [energySelection, setEnergySelection] = useState<Record<number, number>>({});

  // Veri çekme
  useEffect(() => {
    if (!token || !userId) return;
    async function fetchData() {
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

  // App settings çekme (max seviye vs)
  useEffect(() => {
    if (!token) return;
    async function loadSettings() {
      try {
        const settingsRes = await fetchAppSettings(token);
        if (settingsRes.data) {
          setMaxItemLevel(Number(settingsRes.data.maxItemLevel));
          setprogressPerEnergy(Number(settingsRes.data.progressPerEnergy));
        }
      } catch (err) {
        console.error("Settings yüklenemedi:", err);
      }
    }
    loadSettings();
  }, [token]);

  // Progress verisi çekme
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

  // ProgressData ve currentEnergy değiştiğinde, energySelection'u güncelle
  useEffect(() => {
    setEnergySelection((prevSelection) => {
      const newSelection = { ...prevSelection };
      Object.entries(progressData).forEach(([itemIdStr, progress]) => {
        const itemId = Number(itemIdStr);
        const remaining = 100 - progress;
        const maxUsableEnergyByProgress = Math.floor(remaining / progressPerEnergy);
        
        // Hem progress hem de mevcut enerji kontrol edilir
        const validOptions = energyOptions
          .filter((e) => e <= maxUsableEnergyByProgress && e <= currentEnergy)
          .sort((a, b) => b - a);
        
        if (validOptions.length === 0) {
          newSelection[itemId] = 1;
          return;
        }
        
        const currentSelection = prevSelection[itemId] || 1;
        if (!validOptions.includes(currentSelection)) {
          newSelection[itemId] = validOptions[0];
        }
      });
      return newSelection;
    });
  }, [progressData, currentEnergy]); // currentEnergy dependency eklendi

  // Enerji seçimini değiştirme
  const toggleEnergySelection = (id: number, progress: number) => {
    const current = energySelection[id] || 1;
    const remaining = 100 - progress;
    const maxUsableEnergyByProgress = Math.floor(remaining / progressPerEnergy);
  
    const validOptions = energyOptions
      .filter((e) => e <= maxUsableEnergyByProgress && e <= currentEnergy)
      .sort((a, b) => a - b);
  
    if (validOptions.length === 0) {
      setEnergySelection((prev) => ({ ...prev, [id]: 1 }));
      return;
    }
  
    if (!validOptions.includes(current)) {
      setEnergySelection((prev) => ({ ...prev, [id]: validOptions[0] }));
      return;
    }
  
    const currentIndex = validOptions.indexOf(current);
    const nextIndex = (currentIndex + 1) % validOptions.length;
    setEnergySelection((prev) => ({ ...prev, [id]: validOptions[nextIndex] }));
  };

  // Enerji harcama fonksiyonu
  const handleConsumeEnergy = async (amount: number): Promise<boolean> => {
    if (!token) {
      alert("Lütfen giriş yapın.");
      return false;
    }
    if (amount > currentEnergy) {
      alert("Yeterli enerjiniz yok.");
      return false;
    }
    try {
      const result = await consumeEnergy(token, amount);
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

  // Progress artırma fonksiyonu
  const handleIncreaseProgress = async (cardId: number, energyAmount: number) => {
    const success = await handleConsumeEnergy(energyAmount);
    if (!success) return;

    try {
      const res = await increaseProgress(token || "", cardId, energyAmount * progressPerEnergy);
      setProgressData((prev) => ({ ...prev, [cardId]: res.progress }));

      // Eğer progress %100 ve energySelection halen yüksek ise 1'e düşür (otomatik reset)
      if (res.progress >= 100 && energySelection[cardId] !== 1) {
        setEnergySelection((prev) => ({ ...prev, [cardId]: 1 }));
      }
    } catch (e) {
      console.error("Progress artırma hatası:", e);
    }
  };

  // Level up fonksiyonu
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

      // Level up sonrası energy selection 1'e çek
      setEnergySelection((prev) => ({ ...prev, [cardId]: 1 }));
    } catch (e: any) {
      alert(`Seviye atlama başarısız: ${e.message || e}`);
      console.error("Seviye atlama hatası:", e);
    }
  };

  // Filtre uygulama
  const filteredItems =
    levelFilter === "all" ? userItems : userItems.filter((item) => item.currentLevel === levelFilter);

  return (
    <div className="w-full">
      {/* Filtre Panel */}
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

      {/* Eşya Kartları */}
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
          filteredItems.map((itemInstance) => {
            const globalIndex = userItems.findIndex((u) => u.id === itemInstance.id);
            const itemLevel = itemLevels[globalIndex];
            const progress = progressData[itemInstance.id] || 0;
            const isMaxLevel = itemInstance.currentLevel >= maxItemLevel;
            const isReadyToLevelUp = progress >= 100;
            const showLevelUpButton = isReadyToLevelUp && !isMaxLevel;
            const selectedEnergy = energySelection[itemInstance.id] || 1;

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

                  <div className="flex flex-col gap-2 mt-2">
                    {isMaxLevel ? (
                      <button
                        disabled
                        className="w-full rounded-full h-8 flex items-center justify-center gap-2 bg-gray-600 cursor-not-allowed shadow text-[#aaa]"
                      >
                        <img src="/energyIcon.png" alt="Enerji" className="w-7 h-7" /> Max Seviye
                      </button>
                    ) : showLevelUpButton ? (
                      <button
                        className="w-full rounded-full h-8 flex items-center justify-center gap-2 shadow bg-[#EE39A8] text-white"
                        onClick={() => handleLevelUp(itemInstance.id, globalIndex)}
                      >
                        <img src="/energyIcon.png" alt="Enerji" className="w-7 h-7" />
                        Yükselt
                      </button>
                    ) : (
                      <>
                        <div className="relative w-full h-5 bg-[#2b2b2b] rounded-full overflow-hidden border border-[#444]">
                          <div
                            className="absolute top-0 left-0 h-full bg-[#EE39A8] transition-all duration-500 ease-in-out"
                            style={{ width: `${progress}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-[13px] font-bold">
                            %{progress}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-0">
                          <button
                            disabled={currentEnergy < selectedEnergy} // currentEnergy kullanılıyor
                            className={`w-[80%] rounded-full h-8 flex items-center justify-center gap-2 shadow
                              bg-[#FDE68A] text-black
                              disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
                            title={currentEnergy < selectedEnergy ? "Yeterli enerjiniz yok" : undefined}
                            onClick={() => handleIncreaseProgress(itemInstance.id, selectedEnergy)}
                          >
                            <span className="flex items-center gap-1">
                              <img src="/energyIcon.png" className="w-7 h-7" alt="Enerji" />
                              -{selectedEnergy} Geliştir
                            </span>
                          </button>

                          <button
                            className="w-[20%] rounded-full font-bold h-8 flex items-center justify-center gap-1 shadow bg-[#1e1e1e] text-white border border-[#444] hover:bg-[#2a2a2a] transition-colors"
                            onClick={() => toggleEnergySelection(itemInstance.id, progress)}
                          >
                            <span className="text-pink-400 font-bold">×</span>
                            <span className="text-xs">{selectedEnergy}</span>
                          </button>
                        </div>
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