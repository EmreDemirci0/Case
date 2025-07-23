// src/services/energyService.ts
import { API_URL } from "../../../config";

interface BaseResponse<T = any> {
  data: T | null;
  success: boolean;
  message: string;
}

interface EnergyData {
  energy: number;
  lastEnergyUpdateAt: string;
}

export async function fetchEnergy(token?: string|null): Promise<BaseResponse<EnergyData>> {
  try {
    const res = await fetch(`${API_URL}/api/energy`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: BaseResponse<EnergyData> = await res.json();

    // if (!data.success) {
    //   throw new Error(data.message || "Enerji bilgisi alınamadı");
    // }

    return data;
  } catch (error) {
    console.error("Enerji servis hatası:", error);
    return {
      data: null,
      success: false,
      message: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}
export async function consumeEnergy(token: string, amount: number): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_URL}/api/energy/consume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    return {
      success: data.success,
      message: data.message,
    };
  } catch (err) {
    console.error("Enerji harcama hatası:", err);
    return {
      success: false,
      message: "Enerji harcama işlemi başarısız.",
    };
  }
}

export async function fetchAppSettings(token: string|null): Promise<BaseResponse<{ maxEnergy: number, regenMinutes: number,maxItemLevel:number }>> {
  try {
    const res = await fetch(`${API_URL}/app-settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Ayarlar alınamadı");
    return data;
  } catch (error) {
    console.error('Ayarlar servis hatası:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Bilinmeyen hata"
    };
  }
}

export async function fetchUserItems(token: string, userId: number): Promise<any[]> {
  const res = await fetch(`${API_URL}/item-instances/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Item verisi alınamadı.");
  return await res.json();
}

export async function fetchItemLevel(token: string|null, itemId: number, level: number): Promise<any> {
  const res = await fetch(`${API_URL}/item-levels/item/${itemId}/level/${level}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Item level verisi alınamadı.");
  return await res.json();
}

export async function fetchProgress(token: string|null, cardId: number): Promise<{ progress: number; energy: number }> {
  const res = await fetch(`${API_URL}/api/progress`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId }),
  });

  if (!res.ok) throw new Error('Progress verisi alınamadı.');

  const data = await res.json();
  return data; // ya da data.data, eğer backend bunu sarıyorsa
}
export async function increaseProgress(token: string, cardId: number, increment = 2): Promise<{ progress: number }> {
  const res = await fetch(`${API_URL}/api/increase-progress`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId, increment }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Progress arttırılamadı: ${errorText}`);
  }

  return res.json();
}

export async function fetchLevelUp(token: string|null, cardId: number): Promise<{ level: number; progress: number }> {
  const res = await fetch(`${API_URL}/api/level-up`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cardId }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Seviye atlama başarısız: ${errorText}`);
  }

  const data = await res.json();
  return data; // veya data.data, backend cevabına göre
}



