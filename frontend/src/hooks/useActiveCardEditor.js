import { useState, useEffect, useRef } from "react";
import { parseBody, serializeBody, makeId } from "../utils/bodyHelpers";
import { updateNodeInTree } from "../utils/treeHelpers";
import { patchCard } from "../api/cardsApi";

export function useActiveCardEditor({
  activeId,
  activeCard,
  setTree,
  setError,
}) {
  const [titleDraft, setTitleDraft] = useState("");
  const [blocksDraft, setBlocksDraft] = useState(() => parseBody(""));
  const [focusBlockId, setFocusBlockId] = useState(null);
  const [isEditingActive, setIsEditingActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (activeCard) {
      setTitleDraft(activeCard.title);
      setBlocksDraft(parseBody(activeCard.body || ""));
    }
  }, [
    activeCard && activeCard.id,
    activeCard && activeCard.title,
    activeCard && activeCard.body,
  ]);

  useEffect(() => {
    setIsEditingActive(activeCard ? activeCard.title === "" : false);
    setIsExpanded(true);
    setIsClosing(false);
  }, [activeId]);

  useEffect(() => {
    if (isEditingActive && titleRef.current) titleRef.current.focus();
  }, [isEditingActive]);

  const showExpanded = isEditingActive || isExpanded;

  const toggleActiveExpanded = () => {
    if (isEditingActive || isClosing) return;
    if (isExpanded) {
      setIsClosing(true);
      setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, 220);
    } else {
      setIsExpanded(true);
    }
  };

  const handleBodyChange = (id, content) => {
    setBlocksDraft((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content } : b)),
    );
  };

  const handleBodyEnter = (id) => {
    setBlocksDraft((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const newBlock = { id: makeId(), type: "text", content: "" };
      setFocusBlockId(newBlock.id);
      return [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
    });
  };

  const handleBodyTypeChange = (id, type) => {
    setBlocksDraft((prev) =>
      prev.map((b) => (b.id === id ? { ...b, type, content: "" } : b)),
    );
  };

  const handleBodyBackspaceEmpty = (id) => {
    setBlocksDraft((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      setFocusBlockId(prev[idx - 1].id);
      return prev.filter((b) => b.id !== id);
    });
  };

  const handleCancelActiveEdit = () => {
    if (activeCard) {
      setTitleDraft(activeCard.title);
      setBlocksDraft(parseBody(activeCard.body || ""));
      setIsEditingActive(false);
    }
  };

  const handleSaveActive = async () => {
    if (!activeCard) return;
    const cleanedBlocks = blocksDraft.filter(
      (b) => b.content.trim() !== "",
    );
    const finalBlocks =
      cleanedBlocks.length > 0
        ? cleanedBlocks
        : [{ id: makeId(), type: "text", content: "" }];
    setSaving(true);
    try {
      const updated = await patchCard(activeCard.id, {
        title: titleDraft.trim(),
        body: serializeBody(finalBlocks),
      });
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

  return {
    titleDraft,
    setTitleDraft,
    blocksDraft,
    focusBlockId,
    setFocusBlockId,
    isEditingActive,
    setIsEditingActive,
    isExpanded,
    setIsExpanded,
    showExpanded,
    isClosing,
    toggleActiveExpanded,
    saving,
    titleRef,
    handleBodyChange,
    handleBodyEnter,
    handleBodyTypeChange,
    handleBodyBackspaceEmpty,
    handleCancelActiveEdit,
    handleSaveActive,
  };
}
