import { useState, useEffect } from "react";
import { makeId, parseBody, serializeBody } from "../utils/bodyHelpers";
import { addNodeToTree } from "../utils/treeHelpers";
import { createBlock } from "../api/blocksApi";

export function useDrafts({ topicId, setTree, setError }) {
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
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("block-drafts", JSON.stringify(drafts));
    } catch {
      // e.g. private browsing — drafts just won't survive a reload in that case
    }
  }, [drafts]);

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
      cancelDraft(id);
      return;
    }
    const finalBlocks = hasBody
      ? cleanedBlocks
      : [{ id: makeId(), type: "text", content: "" }];
    setSavingDraft(true);
    try {
      const newNode = await createBlock({
        title: draft.title,
        body: serializeBody(finalBlocks),
        parentId: draft.parentId,
        topicId,
      });
      setTree((prev) => addNodeToTree(prev, draft.parentId, newNode));
      cancelDraft(id);
    } catch (err) {
      setError(`Couldn't save that block: ${err.message}`);
    } finally {
      setSavingDraft(false);
    }
  };

  return {
    drafts,
    savingDraft,
    addDraft,
    updateDraft,
    updateDraftBody,
    cancelDraft,
    saveDraft,
  };
}
