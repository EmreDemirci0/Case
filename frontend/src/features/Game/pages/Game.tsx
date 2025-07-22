import React, { useEffect, useState, useRef } from "react";
import useLogout from "../../../hooks/useLogout";
import { useAuth } from "../../../hooks/useAuth";
import { fetchEnergy, fetchAppSettings } from "../services/gameService";

function Game() {
  const cards = new Array(8).fill(null);
  const { token } = useAuth();
  const { logout } = useLogout();
  
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [regenMinutes, setRegenMinutes] = useState(5);
  const [energy, setEnergy] = useState<number | null>(null);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEnergyUpdateAt, setLastEnergyUpdateAt] = useState<Date | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const energyCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ayarları ve enerji bilgilerini yükle
  useEffect(() => {
    if (!token) return;

    const loadSettingsAndEnergy = async () => {
      setLoading(true);
      try {
        // Ayarları al
        const settingsRes = await fetchAppSettings(token);
        if (settingsRes.success && settingsRes.data) {
          const maxE = typeof settingsRes.data.maxEnergy === "string" 
            ? parseFloat(settingsRes.data.maxEnergy) 
            : settingsRes.data.maxEnergy;
          const regenM = typeof settingsRes.data.regenMinutes === "string" 
            ? parseFloat(settingsRes.data.regenMinutes) 
            : settingsRes.data.regenMinutes;
          
          setMaxEnergy(maxE || 20);
          setRegenMinutes(regenM || 5);
        }

        // Enerji bilgisini al
        const energyRes = await fetchEnergy(token);

        if (energyRes.success && energyRes.data) {
          setEnergy(energyRes.data.energy);
          
          // lastEnergyUpdateAt'i al
          const lastUpdateString = (energyRes.data as any).lastEnergyUpdateAt;
          if (lastUpdateString) {
            const lastUpdate = new Date(lastUpdateString);
            setLastEnergyUpdateAt(lastUpdate);
            
            // Bir sonraki enerji artışına kalan süreyi hesapla
            calculateNextEnergyTime(lastUpdate, settingsRes.data?.regenMinutes || regenMinutes);
          } else {
            setSecondsToNextEnergy((settingsRes.data?.regenMinutes || regenMinutes) * 60);
          }
          
          setError(null);
        } else {
          setError(energyRes.message || "Enerji alınamadı");
        }
      } catch (e) {
        setError("Veri alınırken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadSettingsAndEnergy();

    // Cleanup
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (energyCheckRef.current) clearInterval(energyCheckRef.current);
    };
  }, [token]);

  // Bir sonraki enerji zamanını hesapla
  const calculateNextEnergyTime = (lastUpdate: Date, regenMins: number) => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const regenMs = regenMins * 60 * 1000;
    const msPassedInCycle = diffMs % regenMs;
    const msRemaining = regenMs - msPassedInCycle;
    const secondsRemaining = Math.ceil(msRemaining / 1000);
    
    setSecondsToNextEnergy(secondsRemaining);
  };

  // Geri sayım timer'ı - DÜZELTİLDİ
  useEffect(() => {
    if (energy === null || secondsToNextEnergy === null || energy >= maxEnergy) {
      if (timerRef.current) clearInterval(timerRef.current);
      setSecondsToNextEnergy(null);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsToNextEnergy((prevSeconds) => {
        if (prevSeconds === null || prevSeconds <= 0) {
          // Enerjiyi artır
          setEnergy((prevEnergy) => {
            if (prevEnergy === null) return null;
            const newEnergy = Math.min(maxEnergy, prevEnergy + 1);
            
            // Eğer max'a ulaştıysak timer'ı durdur
            if (newEnergy >= maxEnergy) {
              return newEnergy;
            }
            
            return newEnergy;
          });

          // lastEnergyUpdateAt'i güncelle
          const now = new Date();
          setLastEnergyUpdateAt(now);

          // Eğer enerji max'a ulaştıysa null döndür, değilse yeni döngüyü başlat
          return energy + 1 >= maxEnergy ? null : regenMinutes * 60;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [energy, secondsToNextEnergy, maxEnergy, regenMinutes]);

  // Periyodik enerji kontrolü (senkronizasyon için) - DÜZELTİLDİ
  useEffect(() => {
    if (!token) return;

    energyCheckRef.current = setInterval(async () => {
      try {
        const energyRes = await fetchEnergy(token);
        if (energyRes.success && energyRes.data) {
          const serverEnergy = energyRes.data.energy;
          
          // Eğer sunucudaki enerji ile local enerji farklıysa senkronize et
          if (serverEnergy !== energy) {
            setEnergy(serverEnergy);
            
            const lastUpdateString = (energyRes.data as any).lastEnergyUpdateAt;
            if (lastUpdateString && serverEnergy < maxEnergy) {
              const lastUpdate = new Date(lastUpdateString);
              setLastEnergyUpdateAt(lastUpdate);
              calculateNextEnergyTime(lastUpdate, regenMinutes);
            } else if (serverEnergy >= maxEnergy) {
              setSecondsToNextEnergy(null);
            }
          }
        }
      } catch (e) {
        console.error('Periyodik enerji kontrolü hatası:', e);
      }
    }, 30000); // Her 30 saniyede bir kontrol et

    return () => {
      if (energyCheckRef.current) clearInterval(energyCheckRef.current);
    };
  }, [token, energy, maxEnergy, regenMinutes]);

  const energyPercent = energy !== null ? Math.min(100, (energy / maxEnergy) * 100) : 0;
  
  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button onClick={() => logout(token || "")} className="text-blue-400">
          Logout
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">Your bot</h1>
          <p className="text-xs text-gray-400">
            {loading
              ? "Enerji yükleniyor..."
              : error
              ? error
              : energy !== null
              ? `Enerji: ${energy} / ${maxEnergy}`
              : "Enerji bilgisi yok"}
          </p>
        </div>
        <div className="w-6" />
      </div>

      {/* Energy bar - DÜZELTİLDİ */}
      <div className="mt-4 px-2">
        <div className="text-sm font-medium text-pink-400">Enerji</div>
        <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden mt-1">
          <div
            className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-500"
            style={{ width: `${energyPercent}%` }}
          ></div>
          <div className="absolute w-full text-center text-xs text-white leading-5">
            {energy === null 
              ? "Enerji hesaplanıyor..."
              : energy >= maxEnergy 
                ? "Enerji Dolu!"
                : secondsToNextEnergy !== null 
                  ? `1 Enerji Yenilenmesine Kalan: ${formatSeconds(secondsToNextEnergy)}`
                  : "Hesaplanıyor..."
            }
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-4 px-2 overflow-x-auto">
        <button className="bg-yellow-300 text-black text-xs font-semibold rounded-full px-3 py-1">
          Tüm Seviyeler
        </button>
        <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Sv1</button>
        <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Sv2</button>
        <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Max Sv</button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 px-2">
        {cards.map((_, idx) => (
          <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg shadow-md">
            <div className="w-full h-28 bg-gray-700 rounded-md mb-2"></div>
            <div className="text-xs text-right text-white font-semibold mb-1">
              Seviye {idx === 6 ? 3 : idx === 7 ? 2 : 1}
            </div>
            <div className="text-sm font-bold text-white mb-1">Zümrüt Kehanet</div>
            <p className="text-xs text-gray-400 mb-2">Sade, keskin bir savaş kılıcı.</p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className="bg-pink-500 h-2.5 rounded-full"
                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
              ></div>
            </div>
            {/* Buttons */}
            <div className="flex justify-between items-center">
              <div className="text-xs text-pink-400 font-bold">5.00</div>
              <button
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  idx === 0 ? "bg-pink-600" : "bg-gray-700 text-white"
                }`}
              >
                {idx === 0 ? "Yükset" : "Geliştir"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;