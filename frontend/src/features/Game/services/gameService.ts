// src/services/energyService.ts
import { API_URL } from "../../../config";

interface BaseResponse<T = any> {
  data: T | null;
  success: boolean;
  message: string;
}

export async function fetchEnergy(token: string): Promise<BaseResponse<{ energy: number }>> {
  try {
    const res = await fetch(`${API_URL}/energy`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // JSON parse
    const data: BaseResponse<{ energy: number }> = await res.json();

    // Eğer response başarısızsa hata fırlat
    if (!data.success) {
      throw new Error(data.message || "Enerji bilgisi alınamadı");
    }

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
export async function fetchAppSettings(token: string): Promise<BaseResponse<{ maxEnergy: number, regenMinutes: number }>> {
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

