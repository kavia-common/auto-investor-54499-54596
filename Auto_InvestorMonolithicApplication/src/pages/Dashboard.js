import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const pf = await apiRequest("/portfolio", "GET", undefined, true);
        setPortfolio(pf);
        const ai = await apiRequest("/ai/trade-suggestions", "GET", undefined, true);
        setAiSuggestions(ai);
      } catch (e) {
        setError("Failed to load dashboard");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (!user) return null;
  if (loading) return <div className="container"><h3>Loading dashboard...</h3></div>;

  return (
    <div className="container page-dashboard">
      <h2>Portfolio Dashboard</h2>
      {portfolio &&
        <section className="portfolio-summary">
          <div className="card">
            <h4>Value</h4>
            <p>${portfolio.value.toLocaleString()}</p>
          </div>
          <div className="card">
            <h4>Return</h4>
            <p style={{ color: portfolio.return_pct >= 0 ? "green" : "red" }}>
              {portfolio.return_pct}%</p>
          </div>
          <div className="card">
            <h4>Risk</h4>
            <p>{portfolio.risk_level}</p>
          </div>
        </section>
      }

      <section className="ai-section">
        <h3>AI Trade Suggestions</h3>
        <ul className="trade-list">
          {aiSuggestions.map(trade => (
            <li key={trade.id} className="trade-row">
              <span>{trade.symbol}</span>
              <span>{trade.action} {trade.quantity}</span>
              <span>Confidence: {Math.round(trade.confidence * 100)}%</span>
              <Link to={`/trades/${trade.id}`} className="btn btn-xs">Review</Link>
            </li>
          ))}
          {aiSuggestions.length === 0 && <li>No suggestions at this time.</li>}
        </ul>
      </section>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
