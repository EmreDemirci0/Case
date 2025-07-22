import { useEffect, useState } from "react";

interface NotificationProps {
    message: string;
    color?: "red" | "green" | "yellow" | "blue";
    onClose: () => void;
  }
  
  export default function Notification({ message, color = "red", onClose }: NotificationProps) {
    const [closing, setClosing] = useState(false);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setClosing(true);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  
    const handleAnimationEnd = () => {
      if (closing) onClose();
    };
  
    // Renkler için css sınıflarını burada belirleyebilirsin
    const colorClasses = {
      red: "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800",
      green: "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800",
      yellow: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400 dark:border-yellow-800",
      blue: "text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800",
    };
  
    return (
      <div
        className={`fixed top-4 right-4 z-50 ${closing ? "animate-slide-in-reverse" : "animate-slide-in"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div
          className={`flex items-center justify-center p-4 mb-4 text-sm border rounded-lg shadow-md ${colorClasses[color]}`}
          role="alert"
          style={{
            minWidth: 200,    
            maxWidth: "max-content"
          }}
        >
          {/* İkonu renk bazlı değiştirmek istersen buraya ekleyebilirsin */}
          <span className="font-medium capitalize mr-1">{/*color*/}</span> {message}
        </div>
      </div>
    );
  }
  