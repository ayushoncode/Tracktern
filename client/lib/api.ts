const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isLocalHost ? "http://localhost:5002/api" : "https://tracktern-27b8.onrender.com/api");
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
  return res.json();
};
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  return res.json();
};
export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
  return res.json();
};
export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  return res.json();
};
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const res = await fetch(`${API_URL}/auth/reset-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, newPassword }) });
  return res.json();
};
export const getMe = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
export const getCompanies = async (token: string) => {
  const res = await fetch(`${API_URL}/companies`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
export const getStats = async (token: string) => {
  const res = await fetch(`${API_URL}/companies/stats`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
export const addCompany = async (token: string, data: object) => {
  const res = await fetch(`${API_URL}/companies`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
  return res.json();
};
export const updateCompany = async (token: string, id: string, data: object) => {
  const res = await fetch(`${API_URL}/companies/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
  return res.json();
};
export const deleteCompany = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/companies/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
export const saveToken = (token: string) => localStorage.setItem("tracktern_token", token);
export const getToken = () => localStorage.getItem("tracktern_token");
export const removeToken = () => localStorage.removeItem("tracktern_token");
export const saveUser = (user: object) => localStorage.setItem("tracktern_user", JSON.stringify(user));
export const getUser = () => { const u = localStorage.getItem("tracktern_user"); return u ? JSON.parse(u) : null; };

export const getAIPrep = async (token: string, company: string, role: string) => {
  const res = await fetch(`${API_URL}/ai/prep`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ company, role }) });
  return res.json();
};
export const getFollowUpEmail = async (token: string, company: string, role: string) => {
  const res = await fetch(`${API_URL}/ai/followup`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ company, role }) });
  return res.json();
};

export const getJournalEntries = async (token: string) => {
  const res = await fetch(`${API_URL}/journal`, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
export const addJournalEntry = async (token: string, data: object) => {
  const res = await fetch(`${API_URL}/journal`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
  return res.json();
};
export const deleteJournalEntry = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/journal/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  return res.json();
};
