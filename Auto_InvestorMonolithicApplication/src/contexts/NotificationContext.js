import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { apiRequest } from "../api";

// Basic real-time notification context with auto-refresh (for demo purposes)
const NotificationContext = createContext([]);

/**
 * Hook to access notification context.
 * @returns {Object} Notifications context value.
 */
// PUBLIC_INTERFACE
export function useNotifications() {
  return useContext(NotificationContext);
}

/**
 * NotificationProvider supplies notification state and helpers to all descendants via React Context.
 * Ensures notifications state is always an array to prevent runtime errors using .filter().
 */
// PUBLIC_INTERFACE
export function NotificationProvider({ children }) {
  // Always initialize as an array, and enforce array type inside refresh
  const [notifications, setNotifications] = useState([]);
  const timer = useRef();

  // Poll for new notifications every 30 seconds for demo (replace w/ websocket if backend supports)
  useEffect(() => {
    let mounted = true;
    async function refresh() {
      try {
        let newN = await apiRequest("/notifications", "GET", undefined, true);
        // Ensure the API response is always an array, or fallback to []
        if (!Array.isArray(newN)) newN = [];
        if (mounted) setNotifications(newN);
      } catch {
        // Ensure notifications is always set as an array even on error.
        if (mounted) setNotifications([]);
      }
      timer.current = setTimeout(refresh, 30000);
    }
    refresh();
    return () => {
      mounted = false;
      clearTimeout(timer.current);
    };
  }, []);

  // Mark as read helper
  async function markRead(id) {
    await apiRequest(`/notifications/${id}/read`, "POST", undefined, true);
    setNotifications(prev =>
      (Array.isArray(prev) ? prev : []).map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  // Provide a context value where notifications is always an array
  return (
    <NotificationContext.Provider value={{
      notifications,
      markRead,
      unreadCount: (Array.isArray(notifications) ? notifications : []).filter(n => !n.read).length
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
