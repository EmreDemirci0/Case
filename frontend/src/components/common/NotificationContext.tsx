// NotificationContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import Notification from "./Notification";

interface MessageType {
    text: string;
    color?: "red" | "green" | "yellow" | "blue"; // Dilediğin renkleri ekleyebilirsin
}

interface NotificationContextType {
    setNotificationMessage: (msg: string, color?: MessageType["color"]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<MessageType | null>(null);

    const setInfoMessage = (msg: string, color?: MessageType["color"]) => {
        setMessage({ text: msg, color });
    };

    const handleClose = () => setMessage(null);

    return (
        <NotificationContext.Provider value={{ setNotificationMessage: setInfoMessage }}>
            {children}
            {message && <Notification message={message.text} color={message.color} onClose={handleClose} />}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
}
