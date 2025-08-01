import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationBell({ onClick }) {
  const { unreadCount } = useNotifications();

  return (
    <button className="notif-bell" onClick={onClick} aria-label="Notifications">
      <svg width="24" height="24" style={{ verticalAlign: "middle" }} viewBox="0 0 24 24">
        <path
          d="M12 2a7 7 0 0 1 7 7v4l1.29 2.29a1 1 0 0 1-.77 1.71H4.48a1 1 0 0 1-.77-1.71L5 13V9a7 7 0 0 1 7-7zm0 19a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"
          fill="currentColor" />
      </svg>
      {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
    </button>
  );
}
