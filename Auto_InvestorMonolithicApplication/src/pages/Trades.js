import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Trade Review/Override (per trade or list)
 */
export function TradesList() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTrades() {
      try {
        const resp = await apiRequest("/trades/pending", "GET", undefined, true);
        setTrades(resp);
      } catch { setTrades([]); }
      setLoading(false);
    }
    fetchTrades();
  }, []);

  if (loading) return <div className="container"><h3>Loading trades...</h3></div>;

  if (trades.length === 0)
    return <div className="container"><h4>No pending trade suggestions.</h4></div>;

  return (
    <div className="container page-trades">
      <h2>AI Trade Suggestions</h2>
      <ul className="trade-list">
        {trades.map(trade =>
          <li key={trade.id} className="trade-row">
            <span>{trade.symbol}</span>
            <span>{trade.action} {trade.quantity}</span>
            <span>Confidence: {Math.round(trade.confidence * 100)}%</span>
            <a className="btn btn-sm" href={`/trades/${trade.id}`}>Review</a>
          </li>
        )}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
export function TradeReview() {
  const { tradeId } = useParams();
  const [trade, setTrade] = useState(null);
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrade() {
      try {
        const resp = await apiRequest(`/trades/${tradeId}`, "GET", undefined, true);
        setTrade(resp);
      } catch {
        setMsg("Failed to load trade data");
      }
      setLoading(false);
    }
    fetchTrade();
  }, [tradeId]);

  async function submitDecision(newDecision) {
    setLoading(true);
    setMsg("");
    try {
      await apiRequest(`/trades/${tradeId}/review`, "POST", { decision: newDecision }, true);
      setMsg("Trade decision submitted.");
      setTimeout(() => navigate("/trades"), 1000);
    } catch (err) {
      setMsg(err.message);
    }
    setLoading(false);
  }

  if (loading) return <div className="container">Loading...</div>;
  if (!trade) return <div className="container">{msg || "Trade not found."}</div>;

  return (
    <div className="container">
      <h2>Trade Review</h2>
      <div className="trade-row">
        <strong>{trade.symbol} {trade.action} {trade.quantity}</strong>
        <div>AI Confidence: {Math.round(trade.confidence * 100)}%</div>
        <div>AI Suggestion: {trade.reason}</div>
      </div>
      <div style={{ marginTop: 20 }}>
        <button className="btn btn-green" disabled={loading} onClick={() => submitDecision("approve")}>Approve</button>
        <button className="btn btn-red" disabled={loading} onClick={() => submitDecision("modify")}>Modify</button>
        <button className="btn btn-grey" disabled={loading} onClick={() => submitDecision("reject")}>Reject</button>
      </div>
      {msg && <p>{msg}</p>}
    </div>
  );
}

