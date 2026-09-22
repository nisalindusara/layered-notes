import { API_BASE } from "./apiBase";

export async function fetchTopics(subjectId) {
  const res = await fetch(`${API_BASE}/api/subjects/${subjectId}/topics`);
  return res.json();
}

export async function createTopic(subjectId, name) {
  const res = await fetch(`${API_BASE}/api/subjects/${subjectId}/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}
