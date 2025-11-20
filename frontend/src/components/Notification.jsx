import { useEffect, useState } from "react";

export default function Notification({ type, message, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`pointer-events-auto px-6 py-3 rounded-lg shadow-lg transition-transform transform ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-gray-700"
        } text-white`}
        style={{ minWidth: "250px" }}
      >
        {message}
      </div>
    </div>
  );
}
