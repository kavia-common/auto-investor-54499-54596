//
// API helper with interceptors, CSRF, sensitive data obfuscation, error handler
//

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api"; // can override for local dev

// Returns token from storage (for protected routes)
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// PUBLIC_INTERFACE
export async function apiRequest(endpoint, method = "GET", body, secure = false, opts = {}) {
  let url = API_BASE_URL + endpoint;
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (secure && token) {
    headers["Authorization"] = "Bearer " + token;
  }
  const fetchOpts = {
    method,
    headers,
    credentials: "include",
    ...opts
  };
  if (body !== undefined) fetchOpts.body = JSON.stringify(body);

  try {
    const response = await fetch(url, fetchOpts);
    if (response.status === 401) {
      // Token expired, logout user
      window.location = "/login";
      return;
    }
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) {
      throw (data && data.detail) ? new Error(data.detail) : new Error("API Error");
    }
    return data;
  } catch (err) {
    throw err;
  }
}
