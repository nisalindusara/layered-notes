import { useState, useEffect } from "react";
import { findNode } from "../utils/treeHelpers";
import { fetchBlocks, moveBlock, deleteBlock } from "../api/blocksApi";

export function useBlockTree({ topicId, setError }) {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState([]);
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    if (!topicId) return;
    setLoading(true);
    setError(null);
    fetchBlocks(topicId)
      .then((data) => setTree(data))
      .catch((err) =>
        setError(
          `Couldn't reach the API. Is the backend running? (${err.message})`,
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (topicId) loadTree();
  }, [topicId]);

  const drillInto = (id) => setPath((prev) => [...prev, id]);
  const switchSideways = (id) => setPath((prev) => [...prev.slice(0, -1), id]);
  const goUpOne = () => setPath((prev) => prev.slice(0, -1));
  const goToRoot = () => setPath([]);
  const jumpToCrumb = (index) => setPath((prev) => prev.slice(0, index + 1));

  const handleTopPaneSelect = (id) => {
    if (id === activeId) goUpOne();
    else switchSideways(id);
  };

  const handleMove = async (id, action) => {
    try {
      await moveBlock(id, action);
      loadTree();
    } catch (err) {
      setError(`Couldn't move that block: ${err.message}`);
    }
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      await deleteBlock(deletingBlock.id);
      if (deletingBlock.id === activeId) goUpOne();
      setDeletingBlock(null);
      loadTree();
    } catch (err) {
      setError(`Couldn't delete that block: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return {
    tree,
    setTree,
    loading,
    path,
    setPath,
    activeId,
    activeBlock,
    parentBlock,
    topPaneList,
    deletingBlock,
    setDeletingBlock,
    deleting,
    loadTree,
    drillInto,
    switchSideways,
    goUpOne,
    goToRoot,
    jumpToCrumb,
    handleTopPaneSelect,
    handleMove,
    handleDeleteConfirmed,
  };
}
