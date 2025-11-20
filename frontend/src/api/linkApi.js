// const API_BASE = "http://localhost:3001";
const API_BASE = "https://tiny-link-backend-89bi.onrender.com";


export const api = {
  async createLink(originalUrl, customCode = null) {
    const res = await fetch(`${API_BASE}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_url: originalUrl, custom_code: customCode })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },

  async getLinks() {
    const res = await fetch(`${API_BASE}/api/links`);
    return res.json();
  },

  async deleteLink(code) {
    const res = await fetch(`${API_BASE}/api/links/${code}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete");
    return res.json();
  }
};

export { API_BASE };
