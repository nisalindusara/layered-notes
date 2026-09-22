import React, { useState, useRef, useEffect } from "react";

const styles = {
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
};

export default function KebabMenu({ actions }) {
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
