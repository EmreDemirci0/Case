import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { t as localize, ROUTES } from "../config";
import { useNotification } from "../components/common/NotificationContext";
import { sendLogoutRequest } from "../features/auth/services/authService";

export default function useLogout() {
  const navigate = useNavigate();
  const { setNotificationMessage } = useNotification();

  /**
   * Logout fonksiyonu, zorunlu olarak güncel token parametresi alır.
   */
  const logout = useCallback(async (token: string) => {
    console.log("logout", token);
    if (!token) return;
    try {
      const res = await sendLogoutRequest(token);
      console.log("res", res);
      if (res.ok) {
        setNotificationMessage(localize("logoutSuccess"), "green");
      } else {
        setNotificationMessage(localize("logoutError"), "red");
      }
    } catch (err) {
      console.error("Logout isteği başarısız:", err);
      setNotificationMessage(localize("logoutError"), "red");
    }
    localStorage.removeItem("token");
    navigate(ROUTES.LOGIN);
  }, [navigate, setNotificationMessage]);

  return { logout };
}
