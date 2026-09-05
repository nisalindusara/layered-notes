import React, { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

const FONTFAMILY = "'Google Sans', sans-serif";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#EAEDF3",
    fontFamily: FONTFAMILY,
    color: "#1B2430",
    padding: "48px 24px 120px",
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 1180 },
  header: { marginBottom: 24 },
  eyebrow: {
    fontFamily: FONTFAMILY,
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTFAMILY,
    fontSize: 32,
    fontWeight: 600,
    margin: 0,
    color: "#1B2430",
  },

  // ---- Breadcrumbs ----
  breadcrumbBar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    fontSize: 13,
  },
  breadcrumbItem: {
    background: "none",
    border: "none",
    padding: "3px 4px",
    color: "#7B8492",
    cursor: "pointer",
    fontFamily: FONTFAMILY,
    fontSize: 13,
    borderRadius: 3,
  },
  breadcrumbItemActive: {
    color: "#1B2430",
    fontWeight: 600,
    cursor: "default",
  },
  breadcrumbSep: { color: "#C2C8D2", fontSize: 12 },
  parentCard: {
    background: "#E7ECF4",
    border: "1px solid #C9D2E0",
    borderRadius: 4,
    padding: "16px 20px",
    marginBottom: 14,
    cursor: "pointer",
  },
  parentCardLabel: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: 6,
    fontWeight: 600,
  },
  parentCardTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#1B2430",
    marginBottom: 6,
  },
  parentCardBody: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#5B6472",
    whiteSpace: "pre-wrap",
  },

  // ---- Top pane (sibling context) ----
  topPaneWrap: { marginBottom: 18 },
  topPaneList: { display: "flex", flexDirection: "column", gap: 6 },

  // ---- Rows (used in top pane + children list) ----
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "18px 27px",
    borderRadius: 3,
    border: "1px solid transparent",
    cursor: "pointer",
    background: "#FFFFFF",
    transition: "border-color 120ms ease, background 120ms ease",
  },
  rowMuted: {
    background: "transparent",
    boxShadow: "none",
  },
  rowActive: {
    borderColor: "#B8912F",
    background: "#FBF6E9",
  },
  rowTab: {
    fontSize: 11,
    color: "#B8912F",
    border: "1px solid #E4D6A7",
    background: "#FBF6E9",
    borderRadius: 2,
    padding: "2px 6px",
    flexShrink: 0,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 400,
    color: "#1B2430",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rowControls: { display: "flex", alignItems: "center", flexShrink: 0 },
  iconBtn: {
    marginLeft: 2,
    padding: "3px 7px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 3,
    color: "#9AA3B2",
    fontSize: 12,
    cursor: "pointer",
  },
  iconBtnDanger: { color: "#C98E82" },

  // ---- Bottom pane (active block "page") ----
  bottomPane: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 4,
    padding: "26px 28px 24px",
  },
  activeControlsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 10,
  },
  activeTitleInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    fontFamily: FONTFAMILY,
    fontSize: 24,
    fontWeight: 400,
    color: "#1B2430",
    padding: "4px 0",
    marginBottom: 6,
    background: "transparent",
  },
  activeBodyTextarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    resize: "none",
    overflow: "hidden",
    fontFamily: FONTFAMILY,
    fontSize: 15,
    lineHeight: 1.65,
    color: "#3A4250",
    padding: "4px 0",
    minHeight: 60,
    background: "transparent",
  },
  saveBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  btnGhost: {
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 500,
    background: "transparent",
    border: "1px solid transparent",
    color: "#5B6472",
    borderRadius: 3,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 600,
    background: "#1B2430",
    border: "1px solid #1B2430",
    color: "#FFFFFF",
    borderRadius: 3,
    cursor: "pointer",
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
  divider: { borderTop: "1px solid #EEF0F4", margin: "18px 0 16px" },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9AA3B2",
    marginBottom: 10,
    fontWeight: 600,
  },
  childrenList: { display: "flex", flexDirection: "column", gap: 6 },
  emptyChildren: {
    fontSize: 13,
    color: "#AEB4BF",
    fontStyle: "italic",
    padding: "4px 0 4px",
  },

  addButtonWrap: { marginTop: 14 },
  addButton: {
    width: "100%",
    padding: "14px 20px",
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
  },
  plusGlyph: { fontSize: 16, lineHeight: 1 },

  // ---- Dialogs (add / delete) ----
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
  fieldLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#5B6472",
    marginBottom: 6,
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
  confirmBody: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#3A4250",
    marginBottom: 24,
  },

  empty: {
    padding: "40px 0 8px",
    color: "#8891A0",
    fontSize: 14,
    fontStyle: "italic",
  },
  statusLine: { fontSize: 12, color: "#B0483C", marginBottom: 16 },
};

// One-time keyframes for the pane slide/fade transition, injected globally.
const AnimationStyles = () => (
  <style>{`
    @keyframes paneEnter {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pane-animate { animation: paneEnter 220ms ease; }
  `}</style>
);

// ---- Tree helpers ----

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

// ---- Delete confirmation dialog ----

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

// ---- A single row: used in the top (sibling) pane and in the children list ----

function BlockRow({
  block,
  index,
  muted,
  active,
  onSelect,
  onMove,
  onRequestDelete,
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.row,
        ...(muted ? styles.rowMuted : {}),
        ...(active ? styles.rowActive : {}),
        borderColor: active ? "#B8912F" : hovered ? "#D3D8E2" : "transparent",
      }}
      onClick={() => onSelect(block.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
    >
      <span style={styles.rowTab}>{String(index + 1).padStart(3, "0")}</span>
      <span style={styles.rowTitle}>{block.title || "Untitled"}</span>
      <div style={styles.rowControls}>
        {["up", "down", "outdent", "indent"].map((action) => (
          <button
            key={action}
            style={styles.iconBtn}
            title={action}
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, action);
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1B2430")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9AA3B2")}
          >
            {{ up: "▲", down: "▼", outdent: "⇤", indent: "⇥" }[action]}
          </button>
        ))}
        <button
          style={{ ...styles.iconBtn, ...styles.iconBtnDanger }}
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete(block);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function BlockPlatform() {
  const [tree, setTree] = useState([]);
  const [path, setPath] = useState([]); // array of block ids, root -> ... -> active
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [titleDraft, setTitleDraft] = useState("");
  const [bodyDraft, setBodyDraft] = useState("");
  const bodyRef = useRef(null);
  const titleRef = useRef(null);

  const activeId = path.length > 0 ? path[path.length - 1] : null;
  const activeBlock = activeId !== null ? findNode(tree, activeId) : null;
  const parentId = path.length >= 2 ? path[path.length - 2] : null;
  const parentBlock = parentId !== null ? findNode(tree, parentId) : null;

  const topPaneList =
    path.length === 0
      ? []
      : path.length === 1
        ? tree
        : findNode(tree, path[path.length - 2])?.children || [];

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

  // Keep the edit drafts in sync whenever the active block changes
  // (drilling in/out, switching sideways, or after a save/refetch).
  useEffect(() => {
    if (activeBlock) {
      setTitleDraft(activeBlock.title);
      setBodyDraft(activeBlock.body || "");
    }
  }, [
    activeBlock && activeBlock.id,
    activeBlock && activeBlock.title,
    activeBlock && activeBlock.body,
  ]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = "auto";
      bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
    }
  }, [bodyDraft, activeId]);

  useEffect(() => {
    if (activeBlock && activeBlock.title === "" && titleRef.current) {
      titleRef.current.focus();
    }
  }, [activeId]);

  const dirty =
    activeBlock &&
    (titleDraft !== activeBlock.title ||
      bodyDraft !== (activeBlock.body || ""));

  // ---- Navigation ----
  const drillInto = (id) => setPath((prev) => [...prev, id]);
  const switchSideways = (id) => setPath((prev) => [...prev.slice(0, -1), id]);
  const goUpOne = () => setPath((prev) => prev.slice(0, -1));
  const goToRoot = () => setPath([]);
  const jumpToCrumb = (index) => setPath((prev) => prev.slice(0, index + 1));

  const handleTopPaneSelect = (id) => {
    if (id === activeId) goUpOne();
    else switchSideways(id);
  };

  const createBlock = async (parentId) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "", body: "", parentId }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const newNode = await res.json();
      setTree((prev) => addNodeToTree(prev, parentId, newNode));
      return newNode;
    } catch (err) {
      setError(`Couldn't create a new block: ${err.message}`);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // ---- Edit (active block) ----
  const handleSaveActive = async () => {
    if (!activeBlock) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks/${activeBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleDraft.trim(),
          body: bodyDraft.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const updated = await res.json();
      setTree((prev) =>
        updateNodeInTree(prev, updated.id, {
          title: updated.title,
          body: updated.body,
        }),
      );
    } catch (err) {
      setError(`Couldn't save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelActiveEdit = () => {
    if (activeBlock) {
      setTitleDraft(activeBlock.title);
      setBodyDraft(activeBlock.body || "");
    }
  };

  // ---- Move ----
  const handleMove = async (id, action) => {
    try {
      const endpoint =
        action === "up" ? "move-up" : action === "down" ? "move-down" : action;
      const res = await fetch(`${API_BASE}/api/blocks/${id}/${endpoint}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      loadTree();
    } catch (err) {
      setError(`Couldn't move that block: ${err.message}`);
    }
  };

  // ---- Delete ----
  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks/${deletingBlock.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      if (deletingBlock.id === activeId) goUpOne();
      setDeletingBlock(null);
      loadTree();
    } catch (err) {
      setError(`Couldn't delete that block: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const crumbs = [
    { label: "Root", isRoot: true },
    ...path.map((id) => ({ label: findNode(tree, id)?.title || "Untitled" })),
  ];

  return (
    <div style={styles.page}>
      <AnimationStyles />
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Block Platform</div>
          <h1 style={styles.title}>Entries</h1>
        </div>

        {error && <div style={styles.statusLine}>{error}</div>}

        {path.length > 0 && (
          <div style={styles.breadcrumbBar}>
            {crumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={styles.breadcrumbSep}>›</span>}
                <button
                  style={{
                    ...styles.breadcrumbItem,
                    ...(i === crumbs.length - 1
                      ? styles.breadcrumbItemActive
                      : {}),
                  }}
                  onClick={() =>
                    crumb.isRoot ? goToRoot() : jumpToCrumb(i - 1)
                  }
                  disabled={i === crumbs.length - 1}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* ---- ROOT VIEW: nothing open yet ---- */}
        {path.length === 0 && (
          <>
            {!loading && tree.length === 0 && !error && (
              <div style={styles.empty}>
                Nothing here yet. Add the first block below.
              </div>
            )}
            <div key="root" className="pane-animate" style={styles.topPaneList}>
              {tree.map((block, i) => (
                <BlockRow
                  key={block.id}
                  block={block}
                  index={i}
                  onSelect={drillInto}
                  onMove={handleMove}
                  onRequestDelete={setDeletingBlock}
                />
              ))}
            </div>
            <div style={styles.addButtonWrap}>
              <button
                style={styles.addButton}
                onClick={async () => {
                  const newNode = await createBlock(null);
                  if (newNode) drillInto(newNode.id);
                }}
              >
                <span style={styles.plusGlyph}>+</span> Add block
              </button>
            </div>
          </>
        )}

        {/* ---- BLOCK LIST at current level, active block expanded in place ---- */}
        {path.length > 0 && activeBlock && (
          <>
            {parentBlock && (
              <div style={styles.parentCard} onClick={goUpOne}>
                <div style={styles.parentCardLabel}>Container</div>
                <div style={styles.parentCardTitle}>
                  {parentBlock.title || "Untitled"}
                </div>
                {parentBlock.body && (
                  <div style={styles.parentCardBody}>{parentBlock.body}</div>
                )}
              </div>
            )}
            <div
              key={`level-${path.length === 1 ? "root" : path[path.length - 2]}-${activeId}`}
              className="pane-animate"
              style={styles.topPaneList}
            >
              {topPaneList.map((block, i) =>
                block.id === activeId ? (
                  <div key={block.id} style={styles.bottomPane}>
                    <div style={styles.activeControlsRow}>
                      {["up", "down", "outdent", "indent"].map((action) => (
                        <button
                          key={action}
                          style={styles.iconBtn}
                          title={action}
                          onClick={() => handleMove(activeId, action)}
                        >
                          {
                            { up: "▲", down: "▼", outdent: "⇤", indent: "⇥" }[
                              action
                            ]
                          }
                        </button>
                      ))}
                      <button
                        style={{ ...styles.iconBtn, ...styles.iconBtnDanger }}
                        title="Delete"
                        onClick={() => setDeletingBlock(activeBlock)}
                      >
                        ✕
                      </button>
                    </div>

                    <input
                      ref={titleRef}
                      style={styles.activeTitleInput}
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      placeholder="Untitled"
                    />
                    <textarea
                      ref={bodyRef}
                      style={styles.activeBodyTextarea}
                      value={bodyDraft}
                      onChange={(e) => setBodyDraft(e.target.value)}
                      placeholder="Write the details here"
                    />

                    {dirty && (
                      <div style={styles.saveBar}>
                        <button
                          style={styles.btnGhost}
                          onClick={handleCancelActiveEdit}
                        >
                          Cancel
                        </button>
                        <button
                          style={styles.btnPrimary}
                          onClick={handleSaveActive}
                          disabled={saving}
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    )}

                    <div style={styles.divider} />

                    <div style={styles.sectionLabel}>Nested blocks</div>
                    <div style={styles.childrenList}>
                      {(activeBlock.children || []).length === 0 && (
                        <div style={styles.emptyChildren}>
                          No nested blocks yet.
                        </div>
                      )}
                      {(activeBlock.children || []).map((child, ci) => (
                        <BlockRow
                          key={child.id}
                          block={child}
                          index={ci}
                          onSelect={drillInto}
                          onMove={handleMove}
                          onRequestDelete={setDeletingBlock}
                        />
                      ))}
                    </div>

                    <div style={styles.addButtonWrap}>
                      <button
                        style={styles.addButton}
                        onClick={async () => {
                          const newNode = await createBlock(activeId);
                          if (newNode) drillInto(newNode.id);
                        }}
                      >
                        <span style={styles.plusGlyph}>+</span> Add nested block
                      </button>
                    </div>
                  </div>
                ) : (
                  <BlockRow
                    key={block.id}
                    block={block}
                    index={i}
                    muted
                    onSelect={handleTopPaneSelect}
                    onMove={handleMove}
                    onRequestDelete={setDeletingBlock}
                  />
                ),
              )}
              <div style={styles.addButtonWrap}>
                <button
                  style={styles.addButton}
                  onClick={async () => {
                    const parentId =
                      path.length === 1 ? null : path[path.length - 2];
                    const newNode = await createBlock(parentId);
                    if (newNode) switchSideways(newNode.id);
                  }}
                >
                  <span style={styles.plusGlyph}>+</span> Add block
                </button>
              </div>
            </div>
          </>
        )}
      </div>

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
