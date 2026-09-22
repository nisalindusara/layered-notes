import { API_BASE } from "./apiBase";

export async function fetchBlocks(topicId) {
  const res = await fetch(`${API_BASE}/api/blocks?topicId=${topicId}`);
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function createBlock({ title, body, parentId, topicId }) {
  const res = await fetch(`${API_BASE}/api/blocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, parentId, topicId }),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function patchBlock(id, { title, body }) {
  const res = await fetch(`${API_BASE}/api/blocks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function moveBlock(id, action) {
  const endpoint =
    action === "up" ? "move-up" : action === "down" ? "move-down" : action;
  const res = await fetch(`${API_BASE}/api/blocks/${id}/${endpoint}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function deleteBlock(id) {
  const res = await fetch(`${API_BASE}/api/blocks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}
