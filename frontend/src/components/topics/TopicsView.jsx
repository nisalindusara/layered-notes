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
  backLink: {
    background: "none",
    border: "none",
    color: "#7B8492",
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
  },
  topicsList: { display: "flex", flexDirection: "column", gap: 8 },
  topicRow: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 8,
    padding: "14px 16px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
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

export default function TopicsView({
  subjectName,
  topics,
  onSelectTopic,
  onCreateTopic,
  onBack,
}) {
  const [newTopicName, setNewTopicName] = useState("");

  const handleCreate = () => {
    if (!newTopicName.trim()) return;
    onCreateTopic(newTopicName.trim());
    setNewTopicName("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={onBack}>
          ← Subjects
        </button>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Block Platform</div>
          <h1 style={styles.title}>{subjectName || "Topics"}</h1>
        </div>
        <div style={styles.topicsList}>
          {topics.map((t) => (
            <div
              key={t.id}
              style={styles.topicRow}
              onClick={() => onSelectTopic(t.id)}
            >
              {t.name}
            </div>
          ))}
        </div>
        <div style={styles.inlineCreateRow}>
          <input
            style={styles.inlineCreateInput}
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="New topic name"
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
