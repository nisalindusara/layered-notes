import React from "react";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(27,36,48,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 24,
  },
  dialog: {
    background: "#FFFFFF",
    borderRadius: 10,
    width: "100%",
    maxWidth: 480,
    padding: 28,
    boxShadow: "0 20px 60px rgba(27,36,48,0.25)",
  },
  dialogEyebrow: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#B8912F",
    marginBottom: 6,
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 20px 0",
    color: "#1B2430",
  },
  confirmBody: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#3A4250",
    marginBottom: 24,
  },
  dialogActions: { display: "flex", justifyContent: "flex-end", gap: 10 },
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
  btnDanger: {
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    background: "#B0483C",
    border: "1px solid #B0483C",
    color: "#FFFFFF",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default function ConfirmDeleteDialog({
  card,
  deleting,
  onConfirm,
  onCancel,
}) {
  const hasChildren = card.children && card.children.length > 0;
  return (
    <div style={styles.overlay} onMouseDown={onCancel}>
      <div style={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.dialogEyebrow}>Delete entry</div>
        <h2 style={styles.dialogTitle}>Delete "{card.title}"?</h2>
        <div style={styles.confirmBody}>
          {hasChildren
            ? "This will also permanently delete all of its nested cards. This can't be undone."
            : "This can't be undone."}
        </div>
        <div style={styles.dialogActions}>
          <button style={styles.btnGhost} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{
              ...styles.btnDanger,
              opacity: deleting ? 0.6 : 1,
              cursor: deleting ? "not-allowed" : "pointer",
            }}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
