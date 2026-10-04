import { API_BASE } from "./apiBase";

export async function fetchCards(topicId) {
  const res = await fetch(`${API_BASE}/api/cards?topicId=${topicId}`);
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function createCard({ title, body, parentId, topicId }) {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, parentId, topicId }),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function patchCard(id, { title, body }) {
  const res = await fetch(`${API_BASE}/api/cards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function moveCard(id, action) {
  const endpoint =
    action === "up" ? "move-up" : action === "down" ? "move-down" : action;
  const res = await fetch(`${API_BASE}/api/cards/${id}/${endpoint}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function deleteCard(id) {
  const res = await fetch(`${API_BASE}/api/cards/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}
