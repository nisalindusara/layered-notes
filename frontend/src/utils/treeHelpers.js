export function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children && n.children.length) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateNodeInTree(nodes, id, updates) {
  return nodes.map((n) => {
    if (n.id === id) return { ...n, ...updates };
    if (n.children && n.children.length) {
      return { ...n, children: updateNodeInTree(n.children, id, updates) };
    }
    return n;
  });
}

export function addNodeToTree(nodes, parentId, newNode) {
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
