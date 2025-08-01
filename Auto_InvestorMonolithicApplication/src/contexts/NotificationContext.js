import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { apiRequest } from "../api";

// Basic real-time notification context with auto-refresh (for demo purposes)

const NotificationContext = createContext([]);

export function useNotifications() {
  return useContext(NotificationContext);
}

// PUBLIC_INTERFACE
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timer = useRef();

  // Poll for new notifications every 30 seconds for demo (replace w/ websocket if backend supports)
  useEffect(() => {
    let mounted = true;
    async function refresh() {
      try {
        const newN = await apiRequest("/notifications", "GET", undefined, true);
        if (mounted) setNotifications(newN);
      } catch {}
      timer.current = setTimeout(refresh, 30000);
    }
    refresh();
    return () => { mounted = false; clearTimeout(timer.current); };
  }, []);

  // Mark as read helper
  async function markRead(id) {
    await apiRequest(`/notifications/${id}/read`, "POST", undefined, true);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      markRead,
      unreadCount: notifications.filter(n => !n.read).length
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
