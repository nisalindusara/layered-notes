import React, { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#EAEDF3",
    fontFamily: "'Google Sans', sans-serif",
    color: "#1B2430",
    padding: "48px 24px 120px",
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 1180 },
  header: { marginBottom: 24 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: 600, margin: 0, color: "#1B2430" },
  subjectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 14,
  },
  subjectCard: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 10,
    padding: "28px 16px",
    textAlign: "center",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    color: "#1B2430",
  },
  inlineCreateRow: { display: "flex", gap: 8, marginTop: 16 },
  inlineCreateInput: {
    flex: 1,
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    border: "1px solid #D3D8E2",
    borderRadius: 6,
    outline: "none",
  },
  inlineCreateButton: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    background: "#1B2430",
    border: "1px solid #1B2430",
    color: "#FFFFFF",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default function SubjectsView({
  subjects,
  onSelectSubject,
  onCreateSubject,
}) {
  const [newSubjectName, setNewSubjectName] = useState("");

  const handleCreate = () => {
    if (!newSubjectName.trim()) return;
    onCreateSubject(newSubjectName.trim());
    setNewSubjectName("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Block Platform</div>
          <h1 style={styles.title}>Subjects</h1>
        </div>
        <div style={styles.subjectsGrid}>
          {subjects.map((s) => (
            <div
              key={s.id}
              style={styles.subjectCard}
              onClick={() => onSelectSubject(s.id)}
            >
              {s.name}
            </div>
          ))}
        </div>
        <div style={styles.inlineCreateRow}>
          <input
            style={styles.inlineCreateInput}
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="New subject name"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button style={styles.inlineCreateButton} onClick={handleCreate}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
