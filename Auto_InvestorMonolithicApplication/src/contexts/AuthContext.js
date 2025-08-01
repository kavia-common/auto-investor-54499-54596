import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../api";

// Auth context for storing current user, login state, etc.

/**
 * AuthContext provides:
 * - user: user object or null
 * - isLoading: boolean, if auth info is being fetched
 * - login, logout/register, setUser
 */

const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to load user session from backend (or localStorage first)
  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setUser(null); setIsLoading(false); return;
        }
        const userResp = await apiRequest("/auth/me", "GET", undefined, true);
        setUser(userResp);
      } catch {
        setUser(null);
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  // PUBLIC_INTERFACE
  async function login(credentials) {
    setIsLoading(true);
    try {
      const resp = await apiRequest("/auth/login", "POST", credentials);
      localStorage.setItem("authToken", resp.token);
      setUser(resp.user);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }

  // PUBLIC_INTERFACE
  async function register(data) {
    setIsLoading(true);
    try {
      const resp = await apiRequest("/auth/register", "POST", data);
      localStorage.setItem("authToken", resp.token);
      setUser(resp.user);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location = "/login";
  }

  const value = { user, setUser, isLoading, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
