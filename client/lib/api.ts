const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isLocalHost ? "http://localhost:5002/api" : "https://tracktern-27b8.onrender.com/api");

const fetchJson = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { message: data.message || "Request failed" };
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { message: "Request timed out. Please try again." };
    }

    return { message: "Cannot connect to server." };
  } finally {
    clearTimeout(timeout);
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  return fetchJson(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
};
export const loginUser = async (email: string, password: string) => {
  return fetchJson(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
};
export const verifyOtp = async (email: string, otp: string) => {
  return fetchJson(`${API_URL}/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
};
export const forgotPassword = async (email: string) => {
  return fetchJson(`${API_URL}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
};
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  return fetchJson(`${API_URL}/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, newPassword }) });
};
export const changePassword = async (token: string, currentPassword: string, newPassword: string) => {
  return fetchJson(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};
export const getMe = async (token: string) => {
  return fetchJson(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
};
export const getCompanies = async (token: string) => {
  return fetchJson(`${API_URL}/companies`, { headers: { Authorization: `Bearer ${token}` } });
};
export const getStats = async (token: string) => {
  return fetchJson(`${API_URL}/companies/stats`, { headers: { Authorization: `Bearer ${token}` } });
};
export const addCompany = async (token: string, data: object) => {
  return fetchJson(`${API_URL}/companies`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
};
export const updateCompany = async (token: string, id: string, data: object) => {
  return fetchJson(`${API_URL}/companies/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
};
export const deleteCompany = async (token: string, id: string) => {
  return fetchJson(`${API_URL}/companies/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
};
export const saveToken = (token: string) => localStorage.setItem("tracktern_token", token);
export const getToken = () => localStorage.getItem("tracktern_token");
export const removeToken = () => localStorage.removeItem("tracktern_token");
export const saveUser = (user: object) => localStorage.setItem("tracktern_user", JSON.stringify(user));
export const getUser = () => { const u = localStorage.getItem("tracktern_user"); return u ? JSON.parse(u) : null; };

export const getAIPrep = async (token: string, company: string, role: string) => {
  return fetchJson(`${API_URL}/ai/prep`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ company, role }) });
};
export const getFollowUpEmail = async (token: string, company: string, role: string) => {
  return fetchJson(`${API_URL}/ai/followup`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ company, role }) });
};

export const getJournalEntries = async (token: string) => {
  return fetchJson(`${API_URL}/journal`, { headers: { Authorization: `Bearer ${token}` } });
};
export const addJournalEntry = async (token: string, data: object) => {
  return fetchJson(`${API_URL}/journal`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
};
export const deleteJournalEntry = async (token: string, id: string) => {
  return fetchJson(`${API_URL}/journal/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
};
