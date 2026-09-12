import React, { useState, useRef, useEffect } from "react";

import { BlockMath, InlineMath } from "react-katex";

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
    borderRadius: 10,
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
    borderRadius: 8,
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
    borderRadius: 6,
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
  kebabWrap: { position: "relative", flexShrink: 0 },
  kebabTrigger: {
    padding: "3px 8px",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 3,
    color: "#7B8492",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
  },
  kebabMenu: {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 8,
    boxShadow: "0 6px 20px rgba(27,36,48,0.12)",
    minWidth: 170,
    padding: 4,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
  },
  kebabMenuItem: {
    textAlign: "left",
    padding: "8px 10px",
    fontSize: 13,
    fontWeight: 500,
    color: "#3A4250",
    background: "transparent",
    border: "none",
    borderRadius: 3,
    cursor: "pointer",
  },
  kebabMenuItemDanger: { color: "#B0483C" },
  viewTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1B2430",
    marginBottom: 6,
  },
  viewBody: {
    fontSize: 15,
    lineHeight: 1.65,
    color: "#3A4250",
    whiteSpace: "pre-wrap",
    marginBottom: 4,
  },

  // ---- Bottom pane (active block "page") ----
  bottomPane: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 10,
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
  activeHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    marginBottom: 16,
  },
  activeHeaderChevron: {
    fontSize: 13,
    color: "#9AA3B2",
    flexShrink: 0,
    width: 14,
    textAlign: "center",
  },
  activeHeaderTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: 400,
    color: "#1B2430",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  activeHeaderTitleInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 400,
    color: "#1B2430",
    background: "transparent",
    padding: 0,
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
    borderRadius: 8,
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
  draftBodyTextarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    background: "transparent",
    resize: "none",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#5B6472",
    padding: "4px 0",
    minHeight: 50,
  },
  draftActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  bodyBlocksWrap: { display: "flex", flexDirection: "column", gap: 2 },
  bodyBlockWrap: { position: "relative" },
  bodyBlockText: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    resize: "none",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    lineHeight: 1.65,
    color: "#3A4250",
    padding: "4px 0",
    background: "transparent",
  },
  bodyBlockHeading1: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    resize: "none",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#1B2430",
    padding: "8px 0 2px",
    background: "transparent",
  },
  bodyBlockHeading2: {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    resize: "none",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: "#1B2430",
    padding: "6px 0 2px",
    background: "transparent",
  },
  slashMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 2,
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 8,
    boxShadow: "0 6px 20px rgba(27,36,48,0.12)",
    padding: 4,
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    minWidth: 140,
  },
  slashMenuItem: {
    textAlign: "left",
    padding: "8px 10px",
    fontSize: 13,
    fontWeight: 500,
    color: "#3A4250",
    background: "transparent",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  viewHeading1: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1B2430",
    margin: "14px 0 6px",
  },
  viewHeading2: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1B2430",
    margin: "12px 0 4px",
  },
  viewParagraph: {
    fontSize: 15,
    lineHeight: 1.65,
    color: "#3A4250",
    whiteSpace: "pre-wrap",
    margin: "0 0 10px",
  },
  bodyBlockEquationInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px dashed #C7CCD6",
    borderRadius: 6,
    outline: "none",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 14,
    color: "#3A4250",
    padding: "8px 10px",
    background: "#FAFBFC",
  },
  bodyBlockEquationRendered: {
    padding: "10px 12px",
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid transparent",
  },
  equationPlaceholder: { color: "#AEB4BF", fontStyle: "italic", fontSize: 14 },
  equationError: { color: "#B0483C", fontSize: 13, fontStyle: "italic" },
  viewEquationWrap: { padding: "6px 0", margin: "6px 0" },
};

// One-time keyframes for the pane slide/fade transition, injected globally.
const AnimationStyles = () => (
  <style>{`
    @keyframes paneEnter {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pane-animate { animation: paneEnter 220ms ease-out; }
    @keyframes paneExit {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(10px); }
    }
    .pane-closing { animation: paneExit 220ms ease-in; }
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

function makeId() {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseBody(raw) {
  if (!raw) return [{ id: makeId(), type: "text", content: "" }];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // not JSON — treat as a legacy plain-text body
  }
  return [{ id: makeId(), type: "text", content: raw }];
}

function serializeBody(blocks) {
  return JSON.stringify(blocks);
}

function bodyPreviewText(raw) {
  return parseBody(raw)
    .map((b) => b.content)
    .join("\n");
}

function renderMathText(text) {
  const parts = [];
  const regex = /\\\[(.+?)\\\]|\\\((.+?)\\\)/gs;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      parts.push(
        <BlockMath
          key={key++}
          math={match[1]}
          renderError={() => (
            <span style={styles.equationError}>Invalid equation</span>
          )}
        />,
      );
    } else {
      parts.push(
        <InlineMath
          key={key++}
          math={match[2]}
          renderError={() => (
            <span style={styles.equationError}>Invalid equation</span>
          )}
        />,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  return parts;
}

function renderBodyBlocks(raw) {
  const blocks = parseBody(raw);
  const hasContent = blocks.some((b) => b.content.trim() !== "");
  if (!hasContent) {
    return (
      <span style={{ color: "#AEB4BF", fontStyle: "italic" }}>
        No content yet.
      </span>
    );
  }
  return blocks.map((b) => {
    if (b.content.trim() === "") return null;
    if (b.type === "equation") {
      return (
        <div key={b.id} style={styles.viewEquationWrap}>
          <BlockMath
            math={b.content}
            renderError={() => (
              <span style={styles.equationError}>Invalid equation</span>
            )}
          />
        </div>
      );
    }
    const style =
      b.type === "heading1"
        ? styles.viewHeading1
        : b.type === "heading2"
          ? styles.viewHeading2
          : styles.viewParagraph;
    return (
      <div key={b.id} style={style}>
        {b.type === "text" ? renderMathText(b.content) : b.content}
      </div>
    );
  });
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
      <KebabMenu
        actions={[
          { label: "Move up", onClick: () => onMove(block.id, "up") },
          { label: "Move down", onClick: () => onMove(block.id, "down") },
          {
            label: "Move to parent level",
            onClick: () => onMove(block.id, "outdent"),
          },
          {
            label: "Nest under previous",
            onClick: () => onMove(block.id, "indent"),
          },
          {
            label: "Delete",
            onClick: () => onRequestDelete(block),
            danger: true,
          },
        ]}
      />
    </div>
  );
}

function BodyBlockRow({
  block,
  autoFocus,
  onChange,
  onEnter,
  onTypeChange,
  onBackspaceEmpty,
  onFocused,
}) {
  const ref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [equationEditing, setEquationEditing] = useState(block.content === "");

  useEffect(() => {
    if (block.type === "equation" && block.content === "") {
      setEquationEditing(true);
    }
  }, [block.type]);

  useEffect(() => {
    if (block.type === "equation" && equationEditing && ref.current) {
      ref.current.focus();
    }
  }, [equationEditing, block.type]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [block.content]);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
      onFocused();
    }
  }, [autoFocus]);

  useEffect(() => {
    setMenuOpen(block.type !== "equation" && block.content === "/");
  }, [block.content, block.type]);

  const style =
    block.type === "heading1"
      ? styles.bodyBlockHeading1
      : block.type === "heading2"
        ? styles.bodyBlockHeading2
        : styles.bodyBlockText;

  if (block.type === "equation") {
    if (equationEditing) {
      return (
        <div style={styles.bodyBlockWrap}>
          <input
            ref={ref}
            style={styles.bodyBlockEquationInput}
            value={block.content}
            onChange={(e) => onChange(block.id, e.target.value)}
            onBlur={() => setEquationEditing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setEquationEditing(false);
                onEnter(block.id);
              } else if (e.key === "Backspace" && block.content === "") {
                e.preventDefault();
                onBackspaceEmpty(block.id);
              }
            }}
            placeholder="Type LaTeX, e.g. x^2 + y^2 = z^2"
          />
        </div>
      );
    }
    return (
      <div
        style={styles.bodyBlockEquationRendered}
        onClick={() => setEquationEditing(true)}
      >
        {block.content.trim() === "" ? (
          <span style={styles.equationPlaceholder}>
            Click to enter an equation
          </span>
        ) : (
          <BlockMath
            math={block.content}
            renderError={() => (
              <span style={styles.equationError}>Invalid equation</span>
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.bodyBlockWrap}>
      <textarea
        ref={ref}
        style={style}
        value={block.content}
        onChange={(e) => onChange(block.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter(block.id);
          } else if (e.key === "Backspace" && block.content === "") {
            e.preventDefault();
            onBackspaceEmpty(block.id);
          }
        }}
        placeholder={
          block.type === "text" ? "Type '/' for commands, or just write" : ""
        }
      />
      {menuOpen && (
        <div style={styles.slashMenu}>
          {[
            { label: "Text", type: "text" },
            { label: "Heading 1", type: "heading1" },
            { label: "Heading 2", type: "heading2" },
            { label: "Equation", type: "equation" },
          ].map((opt) => (
            <button
              key={opt.type}
              style={styles.slashMenuItem}
              onClick={() => {
                onTypeChange(block.id, opt.type);
                setMenuOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function KebabMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      style={styles.kebabWrap}
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        style={styles.kebabTrigger}
        onClick={() => setOpen((o) => !o)}
        title="More actions"
      >
        ⋮
      </button>
      {open && (
        <div style={styles.kebabMenu}>
          {actions.map((a, i) => (
            <button
              key={i}
              style={{
                ...styles.kebabMenuItem,
                ...(a.danger ? styles.kebabMenuItemDanger : {}),
              }}
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DraftCard({
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

export default function BlockPlatform() {
  const [tree, setTree] = useState([]);
  const [path, setPath] = useState([]); // array of block ids, root -> ... -> active
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [titleDraft, setTitleDraft] = useState("");
  const [bodyBlocksDraft, setBodyBlocksDraft] = useState(() => parseBody(""));
  const [focusBlockId, setFocusBlockId] = useState(null);
  const [isEditingActive, setIsEditingActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [drafts, setDrafts] = useState(() => {
    try {
      const raw = localStorage.getItem("block-drafts");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.map((d) => ({
        ...d,
        body: Array.isArray(d.body) ? d.body : parseBody(d.body || ""),
      }));
    } catch {
      return [];
    }
  });
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
      setBodyBlocksDraft(parseBody(activeBlock.body || ""));
    }
  }, [
    activeBlock && activeBlock.id,
    activeBlock && activeBlock.title,
    activeBlock && activeBlock.body,
  ]);

  // Blank (freshly created) blocks open straight into edit mode;
  // existing blocks open in view mode until "Edit" is clicked.
  useEffect(() => {
    setIsEditingActive(activeBlock ? activeBlock.title === "" : false);
    setIsExpanded(true);
    setIsClosing(false);
  }, [activeId]);

  useEffect(() => {
    if (isEditingActive && titleRef.current) titleRef.current.focus();
  }, [isEditingActive]);

  useEffect(() => {
    if (activeBlock && activeBlock.title === "" && titleRef.current) {
      titleRef.current.focus();
    }
  }, [activeId]);

  useEffect(() => {
    try {
      localStorage.setItem("block-drafts", JSON.stringify(drafts));
    } catch {
      // e.g. private browsing — drafts just won't survive a reload in that case
    }
  }, [drafts]);

  const showExpanded = isEditingActive || isExpanded;
  const toggleActiveExpanded = () => {
    if (isEditingActive || isClosing) return;
    if (isExpanded) {
      setIsClosing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, 220); // matches paneExit's duration
    } else {
      setIsExpanded(true);
    }
  };
  const drillInto = (id) => setPath((prev) => [...prev, id]);
  const switchSideways = (id) => setPath((prev) => [...prev.slice(0, -1), id]);
  const goUpOne = () => setPath((prev) => prev.slice(0, -1));
  const goToRoot = () => setPath([]);
  const jumpToCrumb = (index) => setPath((prev) => prev.slice(0, index + 1));

  const handleTopPaneSelect = (id) => {
    if (id === activeId) goUpOne();
    else switchSideways(id);
  };

  const addDraft = (parentId) => {
    setDrafts((prev) => [
      ...prev,
      {
        id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        parentId,
        title: "",
        body: parseBody(""),
      },
    ]);
  };

  const updateDraft = (id, changes) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...changes } : d)),
    );
  };

  const updateDraftBody = (draftId, updater) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === draftId ? { ...d, body: updater(d.body) } : d)),
    );
  };

  const cancelDraft = (id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const saveDraft = async (id) => {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;

    const cleanedBlocks = draft.body.filter((b) => b.content.trim() !== "");
    const hasBody = cleanedBlocks.length > 0;

    if (!draft.title.trim() && !hasBody) {
      cancelDraft(id); // nothing typed — discard silently, no block created
      return;
    }

    const finalBlocks = hasBody
      ? cleanedBlocks
      : [{ id: makeId(), type: "text", content: "" }];

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          body: serializeBody(finalBlocks),
          parentId: draft.parentId,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const newNode = await res.json();
      setTree((prev) => addNodeToTree(prev, draft.parentId, newNode));
      cancelDraft(id); // saved — remove from the local drafts list
    } catch (err) {
      setError(`Couldn't save that block: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const cleanedBlocks = bodyBlocksDraft.filter((b) => b.content.trim() !== "");
  const finalBlocks =
    cleanedBlocks.length > 0
      ? cleanedBlocks
      : [{ id: makeId(), type: "text", content: "" }];

  // ---- Edit (active block) ----
  const handleSaveActive = async () => {
    if (!activeBlock) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blocks/${activeBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },

        // ...then, inside the fetch call:
        body: JSON.stringify({
          title: titleDraft.trim(),
          body: serializeBody(finalBlocks),
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
      setIsEditingActive(false);
    } catch (err) {
      setError(`Couldn't save changes: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBodyChange = (id, content) => {
    setBodyBlocksDraft((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b)),
    );
  };

  const handleBodyEnter = (id) => {
    setBodyBlocksDraft((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const newBlock = { id: makeId(), type: "text", content: "" };
      setFocusBlockId(newBlock.id);
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
    });
  };

  const handleBodyTypeChange = (id, type) => {
    setBodyBlocksDraft((prev) =>
      prev.map((b) => (b.id === id ? { ...b, type, content: "" } : b)),
    );
  };

  const handleBodyBackspaceEmpty = (id) => {
    setBodyBlocksDraft((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      const prevBlock = prev[idx - 1];
      setFocusBlockId(prevBlock.id);
      return prev.filter((b) => b.id !== id);
    });
  };

  const handleCancelActiveEdit = () => {
    if (activeBlock) {
      setTitleDraft(activeBlock.title);
      setBodyBlocksDraft(parseBody(activeBlock.body || ""));
      setIsEditingActive(false);
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
            {drafts
              .filter((d) => d.parentId === null)
              .map((draft) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  onTitleChange={(title) => updateDraft(draft.id, { title })}
                  onBodyUpdate={(updater) => updateDraftBody(draft.id, updater)}
                  onSave={() => saveDraft(draft.id)}
                  onCancel={() => cancelDraft(draft.id)}
                  saving={saving}
                />
              ))}
            <div style={styles.addButtonWrap}>
              <button
                style={styles.addButton}
                onClick={() => {
                  addDraft(null);
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
                  <div style={styles.parentCardBody}>
                    {renderBodyBlocks(parentBlock.body)}
                  </div>
                )}
              </div>
            )}
            <div
              key={`level-${path.length === 1 ? "root" : path[path.length - 2]}-${activeId}`}
              className="pane-animate"
              style={styles.topPaneList}
            >
              {topPaneList.map((block, i) =>
                block.id === activeId && showExpanded ? (
                  <div
                    key={block.id}
                    style={styles.bottomPane}
                    className={isClosing ? "pane-closing" : "pane-animate"}
                  >
                    <div
                      style={styles.activeHeaderRow}
                      onClick={toggleActiveExpanded}
                    >
                      <span style={styles.rowTab}>
                        {String(i + 1).padStart(3, "0")}
                      </span>
                      {isEditingActive ? (
                        <input
                          ref={titleRef}
                          style={styles.activeHeaderTitleInput}
                          value={titleDraft}
                          onChange={(e) => setTitleDraft(e.target.value)}
                          placeholder="Untitled"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span style={styles.activeHeaderTitle}>
                          {activeBlock.title || "Untitled"}
                        </span>
                      )}
                      <KebabMenu
                        actions={[
                          ...(!isEditingActive
                            ? [
                                {
                                  label: "Edit",
                                  onClick: () => setIsEditingActive(true),
                                },
                              ]
                            : []),
                          {
                            label: "Move up",
                            onClick: () => handleMove(activeId, "up"),
                          },
                          {
                            label: "Move down",
                            onClick: () => handleMove(activeId, "down"),
                          },
                          {
                            label: "Move to parent level",
                            onClick: () => handleMove(activeId, "outdent"),
                          },
                          {
                            label: "Nest under previous",
                            onClick: () => handleMove(activeId, "indent"),
                          },
                          {
                            label: "Delete",
                            onClick: () => setDeletingBlock(activeBlock),
                            danger: true,
                          },
                        ]}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: isClosing ? "0fr" : "1fr",
                        transition: "grid-template-rows 220ms ease-in-out",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        {isEditingActive ? (
                          <>
                            <div style={styles.bodyBlocksWrap}>
                              {bodyBlocksDraft.map((b) => (
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
                          </>
                        ) : (
                          <div>{renderBodyBlocks(activeBlock.body)}</div>
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
                        {drafts
                          .filter((d) => d.parentId === activeId)
                          .map((draft) => (
                            <DraftCard
                              key={draft.id}
                              draft={draft}
                              onTitleChange={(title) =>
                                updateDraft(draft.id, { title })
                              }
                              onBodyUpdate={(updater) =>
                                updateDraftBody(draft.id, updater)
                              }
                              onSave={() => saveDraft(draft.id)}
                              onCancel={() => cancelDraft(draft.id)}
                              saving={saving}
                            />
                          ))}
                        <div style={styles.addButtonWrap}>
                          <button
                            style={styles.addButton}
                            onClick={() => addDraft(activeId)}
                          >
                            <span style={styles.plusGlyph}>+</span> Add nested
                            block
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <BlockRow
                    key={block.id}
                    block={block}
                    index={i}
                    onSelect={
                      block.id === activeId
                        ? () => setIsExpanded(true)
                        : handleTopPaneSelect
                    }
                    onMove={handleMove}
                    onRequestDelete={setDeletingBlock}
                  />
                ),
              )}
              {drafts
                .filter(
                  (d) =>
                    d.parentId ===
                    (path.length === 1 ? null : path[path.length - 2]),
                )
                .map((draft) => (
                  <DraftCard
                    key={draft.id}
                    draft={draft}
                    onTitleChange={(title) => updateDraft(draft.id, { title })}
                    onBodyUpdate={(updater) =>
                      updateDraftBody(draft.id, updater)
                    }
                    onSave={() => saveDraft(draft.id)}
                    onCancel={() => cancelDraft(draft.id)}
                    saving={saving}
                  />
                ))}
              <div style={styles.addButtonWrap}>
                <button
                  style={styles.addButton}
                  onClick={() =>
                    addDraft(path.length === 1 ? null : path[path.length - 2])
                  }
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
