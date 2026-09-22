import React, { useState } from "react";
import KebabMenu from "../common/KebabMenu";

const styles = {
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
  rowMuted: { background: "transparent", boxShadow: "none" },
  rowActive: { borderColor: "#B8912F", background: "#FBF6E9" },
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
};

export default function BlockRow({
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
