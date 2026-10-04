import React, { useState, useRef, useEffect } from "react";
import { BlockMath } from "react-katex";

const styles = {
  blockWrap: { position: "relative" },
  blockText: {
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
  blockHeading1: {
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
  blockHeading2: {
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
  blockEquationInput: {
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
  blockEquationRendered: {
    padding: "10px 12px",
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid transparent",
  },
  equationPlaceholder: { color: "#AEB4BF", fontStyle: "italic", fontSize: 14 },
  equationError: { color: "#B0483C", fontSize: 13, fontStyle: "italic" },
};

export default function BlockRow({
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
    if (block.type === "equation" && block.content === "")
      setEquationEditing(true);
  }, [block.type]);

  useEffect(() => {
    if (block.type === "equation" && equationEditing && ref.current)
      ref.current.focus();
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
      ? styles.blockHeading1
      : block.type === "heading2"
        ? styles.blockHeading2
        : styles.blockText;

  if (block.type === "equation") {
    if (equationEditing) {
      return (
        <div style={styles.blockWrap}>
          <input
            ref={ref}
            style={styles.blockEquationInput}
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
        style={styles.blockEquationRendered}
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
    <div style={styles.blockWrap}>
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
