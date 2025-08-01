import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Registration Page
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  async function handleRegister(e) {
    e.preventDefault();
    setMsg("");
    const result = await register(form);
    if (result.success) {
      navigate("/onboarding");
    } else {
      setMsg(result.error || "Registration failed.");
    }
  }

  return (
    <div className="container page-register">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister} className="form register-form">
        <label>
          Email
          <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </label>
        <label>
          Password
          <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </label>
        <button className="btn btn-large">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
      {msg && <p className="form-error">{msg}</p>}
    </div>
  );
}
