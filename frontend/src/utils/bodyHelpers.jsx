import React from "react";
import { BlockMath, InlineMath } from "react-katex";

const styles = {
  equationError: { color: "#B0483C", fontSize: 13, fontStyle: "italic" },
  viewEquationWrap: { padding: "6px 0", margin: "6px 0" },
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
};

export function makeId() {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function parseBody(raw) {
  if (!raw) return [{ id: makeId(), type: "text", content: "" }];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // not JSON — treat as a legacy plain-text body
  }
  return [{ id: makeId(), type: "text", content: raw }];
}

export function serializeBody(blocks) {
  return JSON.stringify(blocks);
}

export function bodyPreviewText(raw) {
  return parseBody(raw)
    .map((b) => b.content)
    .join("\n");
}

export function renderMathText(text) {
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

export function renderBlocks(raw) {
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
