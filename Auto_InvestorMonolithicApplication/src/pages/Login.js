import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Login Page
 */
export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    const result = await login(form);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setMsg(result.error || "Could not login.");
    }
  }

  return (
    <div className="container page-login">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin} className="form login-form">
        <label>
          Email
          <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
        <label>
          Password
          <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </label>
        <button className="btn btn-large" disabled={isLoading}>Login</button>
      </form>
      <p>
        New to Auto-Investor? <a href="/register">Register here</a>
      </p>
      {msg && <p className="form-error">{msg}</p>}
    </div>
  );
}
