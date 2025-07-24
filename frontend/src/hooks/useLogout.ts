import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { t as localize, ROUTES } from "../config";
import { useNotification } from "../components/common/NotificationContext";
import { sendLogoutRequest } from "../features/auth/services/authService";

export default function useLogout() {
  const navigate = useNavigate();
  const { setNotificationMessage } = useNotification();

  const logout = useCallback(async (token: string|null) => {
    if (!token) return;
    try {
      const res = await sendLogoutRequest(token);
      if (res.ok) {
        setNotificationMessage(localize("infoMessages.logoutSuccess"), "green");
      } else {
        setNotificationMessage(localize("infoMessages.logoutError"), "red");
      }
    } catch (err) {
      console.error("Logout isteği başarısız:", err);
      setNotificationMessage(localize("infoMessages.logoutError"), "red");
    }
    localStorage.removeItem("token");
    navigate(ROUTES.LOGIN);
  }, [navigate, setNotificationMessage]);

  return { logout };
}
