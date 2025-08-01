import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

/**
 * Onboarding Page: KYC/AML & Risk Profiling
 */
export default function Onboarding() {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullname: "", dob: "", address: "", phone: "", // KYC
    employment: "", networth: "", investment_goal: "", // KYC
    risk_tolerance: 3, investing_experience: 3, // Risk profile
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Step 1: KYC Collect (minimal) | Step 2: Risk Profiling

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      if (step === 1) {
        // Submit KYC/AML data (backend will perform any checks)
        await apiRequest("/onboarding/kyc", "POST", form, true);
        setStep(2);
      } else {
        // Submit risk profile
        await apiRequest("/onboarding/risk-profile", "POST", form, true);
        // Mark user as onboarded
        const updated = await apiRequest("/user/refresh", "GET", undefined, true);
        setUser(updated);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    }
    setSubmitting(false);
  }

  if (!user) return null;
  if (user.is_onboarded) { navigate("/dashboard"); return null; }

  return (
    <div className="container page-onboarding">
      <h2>Investor Onboarding</h2>
      <form className="onboarding-form" onSubmit={handleSubmit} autoComplete="off">
        {step === 1 && (
          <>
            <h4>KYC / AML Verification</h4>
            <label>
              Full Name <input required value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} />
            </label>
            <label>
              Date of Birth <input type="date" required value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </label>
            <label>
              Address <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </label>
            <label>
              Phone <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </label>
            <label>
              Employment Status <input value={form.employment} onChange={e => setForm(f => ({ ...f, employment: e.target.value }))} />
            </label>
            <label>
              Net Worth <input value={form.networth} onChange={e => setForm(f => ({ ...f, networth: e.target.value }))} />
            </label>
            <label>
              Investment Goal <input value={form.investment_goal} onChange={e => setForm(f => ({ ...f, investment_goal: e.target.value }))} />
            </label>
            <button className="btn btn-large" type="submit" disabled={submitting}>Continue</button>
          </>
        )}

        {step === 2 && (
          <>
            <h4>Risk Profile & Investment Experience</h4>
            <label>
              Risk Tolerance (1 = Low, 5 = High)
              <input type="range" min="1" max="5" value={form.risk_tolerance}
                onChange={e => setForm(f => ({ ...f, risk_tolerance: parseInt(e.target.value) }))} />
              <span style={{ marginLeft: 10 }}>{form.risk_tolerance}</span>
            </label>
            <label>
              Investing Experience (1 = Novice, 5 = Expert)
              <input type="range" min="1" max="5" value={form.investing_experience}
                onChange={e => setForm(f => ({ ...f, investing_experience: parseInt(e.target.value) }))} />
              <span style={{ marginLeft: 10 }}>{form.investing_experience}</span>
            </label>
            <button className="btn btn-large" type="submit" disabled={submitting}>Finish</button>
          </>
        )}
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}
