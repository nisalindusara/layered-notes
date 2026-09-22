import React, { useState, useRef, useEffect } from "react";
import BodyBlockRow from "./BodyBlockRow";
import { makeId } from "../../utils/bodyHelpers";

const styles = {
  draftCard: {
    background: "#EEF0F3",
    border: "1px dashed #C7CCD6",
    borderRadius: 8,
    padding: "14px 16px",
  },
  draftLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9AA3B2",
    marginBottom: 8,
  },
  draftTitleInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#3A4250",
    marginBottom: 8,
    padding: "4px 0",
  },
  bodyBlocksWrap: { display: "flex", flexDirection: "column", gap: 2 },
  draftActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  btnGhost: {
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 500,
    background: "transparent",
    border: "1px solid transparent",
    color: "#5B6472",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    background: "#1B2430",
    border: "1px solid #1B2430",
    color: "#FFFFFF",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default function DraftCard({
  draft,
  onTitleChange,
  onBodyUpdate,
  onSave,
  onCancel,
  saving,
}) {
  const titleRef = useRef(null);
  const [focusBlockId, setFocusBlockId] = useState(null);

  useEffect(() => {
    titleRef.current && titleRef.current.focus();
  }, []);

  const handleBodyChange = (id, content) => {
    onBodyUpdate((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b)),
    );
  };

  const handleBodyEnter = (id) => {
    onBodyUpdate((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const newBlock = { id: makeId(), type: "text", content: "" };
      setFocusBlockId(newBlock.id);
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
    });
  };

  const handleBodyTypeChange = (id, type) => {
    onBodyUpdate((prev) =>
      prev.map((b) => (b.id === id ? { ...b, type, content: "" } : b)),
    );
  };

  const handleBodyBackspaceEmpty = (id) => {
    onBodyUpdate((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      setFocusBlockId(prev[idx - 1].id);
      return prev.filter((b) => b.id !== id);
    });
  };

  return (
    <div style={styles.draftCard}>
      <div style={styles.draftLabel}>Draft</div>
      <input
        ref={titleRef}
        style={styles.draftTitleInput}
        value={draft.title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled"
      />
      <div style={styles.bodyBlocksWrap}>
        {draft.body.map((b) => (
          <BodyBlockRow
            key={b.id}
            block={b}
            autoFocus={focusBlockId === b.id}
            onFocused={() => setFocusBlockId(null)}
            onChange={handleBodyChange}
            onEnter={handleBodyEnter}
            onTypeChange={handleBodyTypeChange}
            onBackspaceEmpty={handleBodyBackspaceEmpty}
          />
        ))}
      </div>
      <div style={styles.draftActions}>
        <button style={styles.btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button style={styles.btnPrimary} onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
