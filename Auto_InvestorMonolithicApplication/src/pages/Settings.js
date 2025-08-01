import React, { useState, useEffect } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../contexts/AuthContext";

// Broker API key management and risk preferences page
export default function Settings() {
  const { user, setUser } = useAuth();
  const [brokerKeys, setBrokerKeys] = useState({ broker: "", apiKey: "" });
  const [risk, setRisk] = useState({ risk_tolerance: "", investing_experience: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const keys = await apiRequest("/user/broker-keys", "GET", undefined, true);
        setBrokerKeys(keys || { broker: "", apiKey: "" });
        const riskPref = await apiRequest("/user/risk-profile", "GET", undefined, true);
        setRisk(riskPref || {});
      } catch (e) {}
    }
    init();
  }, []);

  // PUBLIC_INTERFACE
  async function saveBrokerKeys(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/user/broker-keys", "POST", brokerKeys, true);
      setMsg("Broker API key saved securely.");
    } catch (err) { setMsg("Could not save broker API key."); }
    setSaving(false);
  }

  // PUBLIC_INTERFACE
  async function saveRisk(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/user/risk-profile", "POST", risk, true);
      setMsg("Risk preferences updated.");
      // Optionally refresh user risk profile in context
      const updated = await apiRequest("/user/refresh", "GET", undefined, true);
      setUser(updated);
    } catch (err) { setMsg("Could not update risk profile."); }
    setSaving(false);
  }

  return (
    <div className="container page-settings">
      <h2>Settings</h2>

      <section>
        <h4>Broker API Key Management</h4>
        <form className="form card" onSubmit={saveBrokerKeys}>
          <label>
            Broker Name
            <input required value={brokerKeys.broker}
              onChange={e => setBrokerKeys(b => ({ ...b, broker: e.target.value }))} />
          </label>
          <label>
            Broker API Key
            <input type="password" required value={brokerKeys.apiKey}
              onChange={e => setBrokerKeys(b => ({ ...b, apiKey: e.target.value }))} />
          </label>
          <button className="btn btn-large" disabled={saving}>Save API Key</button>
        </form>
      </section>
      <section>
        <h4>Risk Preferences</h4>
        <form className="form card" onSubmit={saveRisk}>
          <label>
            Risk Tolerance (1 - Low, 5 - High)
            <input type="range" min="1" max="5" value={risk.risk_tolerance || 3}
              onChange={e => setRisk(r => ({ ...r, risk_tolerance: e.target.value }))} />
            <span>{risk.risk_tolerance}</span>
          </label>
          <label>
            Investing Experience (1 - Novice, 5 - Expert)
            <input type="range" min="1" max="5" value={risk.investing_experience || 3}
              onChange={e => setRisk(r => ({ ...r, investing_experience: e.target.value }))} />
            <span>{risk.investing_experience}</span>
          </label>
          <button className="btn btn-large" disabled={saving}>Save Preferences</button>
        </form>
      </section>
      {msg && <div className="form-msg">{msg}</div>}
    </div>
  );
}
