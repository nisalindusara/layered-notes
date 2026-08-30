import React, { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const INDENT = 28;
const FONTFAMILY = '"DM Sans", sans-serif';

const styles = {
  page: {
    minHeight: "100vh",
    background: "#EAEDF3",
    fontFamily: FONTFAMILY,
    color: "#1B2430",
    padding: "64px 24px 120px",
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 1180 },
  header: { marginBottom: 40 },
  title: {
    fontFamily: FONTFAMILY,
    fontSize: 32,
    fontWeight: 600,
    margin: 0,
    color: "#1B2430",
  },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 3,
    boxShadow: "0 1px 2px rgba(27,36,48,0.04)",
    position: "relative",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  },
  cardInner: { padding: "18px 22px 18px 22px" },
  cardRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    cursor: "pointer",
  },
  tab: {
    fontFamily: FONTFAMILY,
    fontSize: 11,
    color: "#B8912F",
    border: "1px solid #E4D6A7",
    background: "#FBF6E9",
    borderRadius: 2,
    padding: "2px 6px",
    flexShrink: 0,
    marginTop: 2,
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  },
  cardTitle: {
    fontFamily: FONTFAMILY,
    fontSize: 24,
    fontWeight: 400,
    color: "#1B2430",
    margin: 0,
    lineHeight: 1.4,
  },
  chevron: {
    marginLeft: "auto",
    color: "#9AA3B2",
    fontSize: 13,
    transition: "transform 160ms ease",
    flexShrink: 0,
    marginTop: 4,
  },
  body: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #EEF0F4",
    fontSize: 15,
    lineHeight: 1.65,
    color: "#3A4250",
    whiteSpace: "pre-wrap",
  },
  childrenWrap: {
    marginTop: 16,
    marginLeft: 8,
    paddingLeft: INDENT - 8,
    borderLeft: "2px solid #E7EAF0",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  addButtonWrap: { marginTop: 14 },
  addButton: {
    width: "100%",
    padding: "16px 22px",
    background: "transparent",
    border: "1.5px dashed #B7BFCC",
    borderRadius: 3,
    color: "#5B6472",
    fontFamily: FONTFAMILY,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition:
      "border-color 120ms ease, color 120ms ease, background 120ms ease",
  },
  nestedAddButton: {
    padding: "9px 14px",
    background: "transparent",
    border: "1.5px dashed #C7CDD8",
    borderRadius: 3,
    color: "#7B8492",
    fontFamily: FONTFAMILY,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    transition:
      "border-color 120ms ease, color 120ms ease, background 120ms ease",
  },
  editButton: {
    marginLeft: 8,
    padding: "3px 9px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 3,
    color: "#7B8492",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    flexShrink: 0,
  },
  moveButton: {
    marginLeft: 4,
    padding: "3px 7px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 3,
    color: "#7B8492",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    cursor: "pointer",
    flexShrink: 0,
  },
  deleteButton: {
    marginLeft: 4,
    padding: "3px 7px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 3,
    color: "#B0483C",
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    cursor: "pointer",
    flexShrink: 0,
  },
  confirmBody: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#3A4250",
    marginBottom: 24,
  },
  btnDanger: {
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    background: "#B0483C",
    border: "1px solid #B0483C",
    color: "#FFFFFF",
    borderRadius: 3,
    cursor: "pointer",
  },
  plusGlyph: {
    fontFamily: FONTFAMILY,
    fontSize: 16,
    lineHeight: 1,
  },
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
    borderRadius: 4,
    width: "100%",
    maxWidth: 480,
    padding: 28,
    boxShadow: "0 20px 60px rgba(27,36,48,0.25)",
  },
  dialogEyebrow: {
    fontFamily: FONTFAMILY,
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#B8912F",
    marginBottom: 6,
  },
  dialogTitle: {
    fontFamily: FONTFAMILY,
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 20px 0",
    color: "#1B2430",
  },
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#5B6472",
    marginBottom: 6,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 15,
    fontFamily: FONTFAMILY,
    border: "1px solid #D3D8E2",
    borderRadius: 3,
    color: "#1B2430",
    outline: "none",
    marginBottom: 18,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 15,
    fontFamily: FONTFAMILY,
    border: "1px solid #D3D8E2",
    borderRadius: 3,
    color: "#1B2430",
    outline: "none",
    marginBottom: 22,
    resize: "vertical",
    minHeight: 110,
    lineHeight: 1.5,
  },
  dialogActions: { display: "flex", justifyContent: "flex-end", gap: 10 },
  btnGhost: {
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 500,
    background: "transparent",
    border: "1px solid transparent",
    color: "#5B6472",
    borderRadius: 3,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    background: "#1B2430",
    border: "1px solid #1B2430",
    color: "#FFFFFF",
    borderRadius: 3,
    cursor: "pointer",
  },
  empty: {
    padding: "40px 0 8px",
    color: "#8891A0",
    fontSize: 14,
    fontStyle: "italic",
    fontFamily: FONTFAMILY,
  },
  statusLine: {
    fontFamily: FONTFAMILY,
    fontSize: 12,
    color: "#B0483C",
    marginBottom: 16,
  },
};

// Local-only helper: insert a freshly-created node (returned by the API)
// into the in-memory tree without waiting for a full refetch.
function addNodeToTree(nodes, parentId, newNode) {
  if (parentId === null) return [...nodes, newNode];
  return nodes.map((n) => {
    if (n.id === parentId) {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    if (n.children && n.children.length) {
      return { ...n, children: addNodeToTree(n.children, parentId, newNode) };
    }
    return n;
  });
}

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children && n.children.length) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateNodeInTree(nodes, id, updates) {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, ...updates };
    if (n.children && n.children.length) {
      return { ...n, children: updateNodeInTree(n.children, id, updates) };
    }
    return n;
  });
}

function AddDialog({
  heading = "Add an entry",
  contextLabel,
  initialTitle = "",
  initialBody = "",
  submitLabel = "Save",
  saving,
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current && titleRef.current.focus();
  }, []);

  const canSave = title.trim().length > 0 && !saving;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ title: title.trim(), body: body.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCancel();
    if (e.key === "Enter" && e.metaKey) handleSave();
  };

  return (
    <div style={styles.overlay} onMouseDown={onCancel}>
      <div
        style={styles.dialog}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div style={styles.dialogEyebrow}>{contextLabel}</div>
        <h2 style={styles.dialogTitle}>{heading}</h2>

        <label style={styles.fieldLabel} htmlFor="block-title">
          Title
        </label>
        <input
          id="block-title"
          ref={titleRef}
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a name"
        />

        <label style={styles.fieldLabel} htmlFor="block-body">
          Body
        </label>
        <textarea
          id="block-body"
          style={styles.textarea}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the details here"
        />

        <div style={styles.dialogActions}>
          <button style={styles.btnGhost} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={{
              ...styles.btnPrimary,
              opacity: canSave ? 1 : 0.4,
              cursor: canSave ? "pointer" : "not-allowed",
            }}
            onClick={handleSave}
            disabled={!canSave}
          >
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteDialog({ block, deleting, onConfirm, onCancel }) {
  const hasChildren = block.children && block.children.length > 0;
  return (
    <div style={styles.overlay} onMouseDown={onCancel}>
      <div style={styles.dialog} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.dialogEyebrow}>Delete entry</div>
        <h2 style={styles.dialogTitle}>Delete "{block.title}"?</h2>
        <div style={styles.confirmBody}>
          {hasChildren
            ? "This will also permanently delete all of its nested blocks. This can't be undone."
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

function BlockNode({
  block,
  label,
  expandedIds,
  onToggle,
  onRequestAdd,
  onRequestEdit,
  onMove,
  onRequestDelete,
}) {
  const [hovered, setHovered] = useState(false);
  const expanded = expandedIds.has(block.id);
  const children = block.children || [];

  return (
    <div
      style={{
        ...styles.card,
        borderColor: hovered ? "#9AA3B2" : "#D3D8E2",
        boxShadow: hovered
          ? "0 2px 8px rgba(27,36,48,0.08)"
          : "0 1px 2px rgba(27,36,48,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardInner}>
        <div
          style={styles.cardRow}
          onClick={() => onToggle(block.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle(block.id);
            }
          }}
          aria-expanded={expanded}
        >
          <span style={styles.tab}>{label}</span>
          <h3 style={styles.cardTitle}>{block.title}</h3>
          <button
            style={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              onRequestEdit(block);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#1B2430";
              e.currentTarget.style.borderColor = "#D3D8E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#7B8492";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            Edit
          </button>
          {["up", "down", "outdent", "indent"].map((action) => (
            <button
              key={action}
              style={styles.moveButton}
              onClick={(e) => {
                e.stopPropagation();
                onMove(block.id, action);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1B2430")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7B8492")}
              title={action}
            >
              {{ up: "▲", down: "▼", outdent: "⇤", indent: "⇥" }[action]}
            </button>
          ))}
          <button
            style={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(block);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#F0D5D0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "transparent")
            }
            title="Delete"
          >
            ✕
          </button>
          <span
            style={{
              ...styles.chevron,
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▸
          </span>
        </div>

        {expanded && (
          <>
            <div style={styles.body}>
              {block.body || (
                <span style={{ color: "#B0B6C0" }}>No body written.</span>
              )}
            </div>

            {children.length > 0 && (
              <div style={styles.childrenWrap}>
                {children.map((child, i) => (
                  <BlockNode
                    key={child.id}
                    block={child}
                    label={`${label}.${String(i + 1).padStart(2, "0")}`}
                    expandedIds={expandedIds}
                    onToggle={onToggle}
                    onRequestAdd={onRequestAdd}
                    onRequestEdit={onRequestEdit}
                    onMove={onMove}
                    onRequestDelete={onRequestDelete}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                ...styles.childrenWrap,
                marginTop: children.length > 0 ? 0 : 16,
                paddingTop: children.length > 0 ? 4 : 0,
                borderLeft:
                  children.length > 0
                    ? styles.childrenWrap.borderLeft
                    : "2px solid #E7EAF0",
              }}
            >
              <button
                style={styles.nestedAddButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestAdd(block.id);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#B8912F";
                  e.currentTarget.style.color = "#B8912F";
                  e.currentTarget.style.background = "#FBF6E9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#C7CDD8";
                  e.currentTarget.style.color = "#7B8492";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={styles.plusGlyph}>+</span>
                Add nested block
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BlockPlatform() {
  const [tree, setTree] = useState([]);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [dialogParentId, setDialogParentId] = useState(undefined); // undefined = closed, null = root
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTree = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/blocks`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
      })
      .then((data) => setTree(data))
      .catch((err) =>
        setError(
          `Couldn't reach the API at ${API_BASE}. Is the backend running? (${err.message})`,
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTree();
  }, []);

  const handleSave = async ({ title, body }) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, parentId: dialogParentId }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const newNode = await res.json();

      setTree((prev) => addNodeToTree(prev, dialogParentId, newNode));
      if (dialogParentId !== null) {
        setExpandedIds((prev) => new Set(prev).add(dialogParentId));
      }
      setDialogParentId(undefined);
    } catch (err) {
      setError(`Couldn't save that block: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async ({ title, body }) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks/${editingBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const updated = await res.json();

      setTree((prev) =>
        updateNodeInTree(prev, updated.id, {
          title: updated.title,
          body: updated.body,
        }),
      );
      setEditingBlock(null);
    } catch (err) {
      setError(`Couldn't save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (id, action) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/blocks/${id}/${action === "up" ? "move-up" : action === "down" ? "move-down" : action}`,
        {
          method: "POST",
        },
      );
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      loadTree();
    } catch (err) {
      setError(`Couldn't move that block: ${err.message}`);
    }
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks/${deletingBlock.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setDeletingBlock(null);
      loadTree();
    } catch (err) {
      setError(`Couldn't delete that block: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const dialogOpen = dialogParentId !== undefined;
  const dialogParentNode =
    dialogParentId !== undefined && dialogParentId !== null
      ? findNode(tree, dialogParentId)
      : null;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Entries</h1>
        </div>

        {error && <div style={styles.statusLine}>{error}</div>}

        {!loading && tree.length === 0 && !error && (
          <div style={styles.empty}>
            Nothing here yet. Add the first block below.
          </div>
        )}

        <div style={styles.list}>
          {tree.map((block, i) => (
            <BlockNode
              key={block.id}
              block={block}
              label={String(i + 1).padStart(3, "0")}
              expandedIds={expandedIds}
              onToggle={toggleExpanded}
              onRequestAdd={(parentId) => setDialogParentId(parentId)}
              onRequestEdit={(b) => setEditingBlock(b)}
              onMove={handleMove}
              onRequestDelete={(b) => setDeletingBlock(b)}
            />
          ))}
        </div>

        <div style={styles.addButtonWrap}>
          <button
            style={styles.addButton}
            onClick={() => setDialogParentId(null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#B8912F";
              e.currentTarget.style.color = "#B8912F";
              e.currentTarget.style.background = "#FBF6E9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#B7BFCC";
              e.currentTarget.style.color = "#5B6472";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={styles.plusGlyph}>+</span>
            Add block
          </button>
        </div>
      </div>

      {dialogOpen && (
        <AddDialog
          contextLabel={
            dialogParentNode
              ? `Nested under: ${dialogParentNode.title}`
              : "Top level"
          }
          saving={saving}
          onSave={handleSave}
          onCancel={() => setDialogParentId(undefined)}
        />
      )}
      {editingBlock && (
        <AddDialog
          heading="Edit entry"
          contextLabel={`Editing: ${editingBlock.title}`}
          initialTitle={editingBlock.title}
          initialBody={editingBlock.body}
          submitLabel="Save changes"
          saving={saving}
          onSave={handleEditSave}
          onCancel={() => setEditingBlock(null)}
        />
      )}
      {deletingBlock && (
        <ConfirmDeleteDialog
          block={deletingBlock}
          deleting={deleting}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeletingBlock(null)}
        />
      )}
    </div>
  );
}
