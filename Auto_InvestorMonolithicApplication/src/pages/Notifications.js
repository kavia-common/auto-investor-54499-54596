import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationsPage() {
  const { notifications, markRead } = useNotifications();

  return (
    <div className="container page-notifications">
      <h2>Notifications</h2>
      <ul className="notif-list">
        {notifications.map(notif => (
          <li key={notif.id} className={"notif-row" + (notif.read ? " read" : "")}>
            <div>
              <strong>{notif.type.replace("_", " ")}:</strong> {notif.message}
            </div>
            <span>{(new Date(notif.timestamp)).toLocaleString()}</span>
            {!notif.read &&
              <button className="btn btn-xs" onClick={() => markRead(notif.id)}>
                Mark read
              </button>
            }
          </li>
        ))}
        {notifications.length === 0 && <li>No notifications yet.</li>}
      </ul>
    </div>
  );
}
