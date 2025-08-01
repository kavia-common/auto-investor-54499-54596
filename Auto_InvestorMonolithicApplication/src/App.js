import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import NotificationsPage from "./pages/Notifications";
import { TradesList, TradeReview } from "./pages/Trades";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NotFound from "./pages/NotFound";

// THEME: global toggle
function AppInner() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Always show nav except onboarding/login/register
  const { user, isLoading } = useAuth();

  // Restrict navigation based on onboarding/auth state
  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >{theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
      {(user && user.is_onboarded) && <NavBar />}

      {/* SPA Routing */}
      <Routes>
        {/* Auth/Onboarding */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/onboarding" element={user && !user.is_onboarded ? <Onboarding /> : <Navigate to="/dashboard" />} />

        {/* Main app (all require onboarded, optionally restrict more) */}
        <Route path="/dashboard" element={user && user.is_onboarded ? <Dashboard /> : <Navigate to="/onboarding" />} />
        <Route path="/trades" element={user && user.is_onboarded ? <TradesList /> : <Navigate to="/onboarding" />} />
        <Route path="/trades/:tradeId" element={user && user.is_onboarded ? <TradeReview /> : <Navigate to="/onboarding" />} />
        <Route path="/notifications" element={user && user.is_onboarded ? <NotificationsPage /> : <Navigate to="/onboarding" />} />
        <Route path="/settings" element={user && user.is_onboarded ? <Settings /> : <Navigate to="/onboarding" />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        {/* Default routes */}
        <Route path="/" element={<Navigate to={user ? (user.is_onboarded ? "/dashboard" : "/onboarding") : "/login"} />} />
      </Routes>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppInner />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
