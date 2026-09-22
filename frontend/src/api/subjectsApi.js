import { API_BASE } from "./apiBase";

export async function fetchSubjects() {
  const res = await fetch(`${API_BASE}/api/subjects`);
  return res.json();
}

export async function createSubject(name) {
  const res = await fetch(`${API_BASE}/api/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}
