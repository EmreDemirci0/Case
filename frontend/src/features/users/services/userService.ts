import { API_URL } from "../../../config";

export async function fetchUserById(token: string, userId: number) {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    // Token geçersiz veya süresi dolmuş
    throw new Error("Unauthorized");
  }

  if (res.status === 404) {
    // Kullanıcı bulunamadı
    throw new Error("User not found");
  }

  if (res.status === 400) {
    // Geçersiz ID formatı
    throw new Error("Invalid user ID");
  }

  const data = await res.json();
  return data;
}
