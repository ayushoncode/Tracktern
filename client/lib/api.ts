const API_URL = "http://localhost:5001/api";
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
  return res.json();
};
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
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
