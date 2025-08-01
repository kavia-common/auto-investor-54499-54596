import React from "react";

export default function NotFound() {
  return (
    <div className="container page-404">
      <h2>404</h2>
      <p>The page you requested was not found.</p>
      <a href="/dashboard" className="btn">Back to Dashboard</a>
    </div>
  );
}
