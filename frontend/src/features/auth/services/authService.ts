import { API_URL } from "../../../config";

export async function sendLoginRequest(email: string, password: string) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
}
export async function sendRegisterRequest(fullName: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password }),
    });

    const data = await res.json();
    return data;
}

export async function sendLogoutRequest(token: string): Promise<Response> {
    return fetch(`${API_URL}/user/logout`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
}

export const decodeToken = (token: string): {userId: number } | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {userId: payload.userId };
    } catch (error) {
        console.error('Token decode hatası:', error);
        return null;
    }
};