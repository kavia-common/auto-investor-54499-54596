import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard" className="navbar-logo">AutoInvestor</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link className={location.pathname === "/dashboard" ? "active" : ""} to="/dashboard">
            Dashboard
          </Link>
        </li>
        {user && user.is_onboarded && (
          <>
            <li>
              <Link className={location.pathname === "/trades" ? "active" : ""} to="/trades">
                Trades
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/settings" ? "active" : ""} to="/settings">
                Settings
              </Link>
            </li>
            <li>
              <Link className={location.pathname === "/notifications" ? "active" : ""} to="/notifications">
                Notifications{unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="nav-user">
        {user
          ? (
            <>
              <span className="nav-user-email" title={user.email}>{user.email}</span>
              <button className="btn btn-small" onClick={logout}>Logout</button>
            </>
          )
          : <Link className="btn btn-small" to="/login">Login</Link>
        }
      </div>
    </nav>
  );
}
