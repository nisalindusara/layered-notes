import React from "react";
import AnimationStyles from "../common/AnimationStyles";
import KebabMenu from "../common/KebabMenu";
import CardRow from "./CardRow";
import BlockRow from "./BlockRow";
import DraftCard from "./DraftCard";
import { renderBlocks } from "../../utils/bodyHelpers";
import { findNode } from "../../utils/treeHelpers";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#EAEDF3",
    fontFamily: "'Google Sans', sans-serif",
    color: "#1B2430",
    padding: "48px 24px 120px",
    display: "flex",
    justifyContent: "center",
  },
  container: { width: "100%", maxWidth: 1180 },
  header: { marginBottom: 24 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: 600, margin: 0, color: "#1B2430" },
  backLink: {
    background: "none",
    border: "none",
    color: "#7B8492",
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
  },
  topNavCrumb: { fontSize: 13, color: "#7B8492", marginBottom: 8 },
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
    fontSize: 13,
    borderRadius: 3,
  },
  breadcrumbItemActive: {
    color: "#1B2430",
    fontWeight: 600,
    cursor: "default",
  },
  breadcrumbSep: { color: "#C2C8D2", fontSize: 12 },
  empty: {
    padding: "40px 0 8px",
    color: "#8891A0",
    fontSize: 14,
    fontStyle: "italic",
  },
  statusLine: { fontSize: 12, color: "#B0483C", marginBottom: 16 },
  topPaneList: { display: "flex", flexDirection: "column", gap: 6 },
  addButtonWrap: { marginTop: 14 },
  addButton: {
    width: "100%",
    padding: "14px 20px",
    background: "transparent",
    border: "1.5px dashed #B7BFCC",
    borderRadius: 8,
    color: "#5B6472",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  plusGlyph: { fontSize: 16, lineHeight: 1 },
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
  bottomPane: {
    background: "#FFFFFF",
    border: "1px solid #D3D8E2",
    borderRadius: 10,
    padding: "26px 28px 24px",
  },
  activeHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    marginBottom: 16,
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
};

export default function TopicContentView({
  subjectName,
  topicName,
  error,
  loading,
  tree,
  path,
  activeId,
  activeCard,
  parentCard,
  topPaneList,
  drillInto,
  goUpOne,
  goToRoot,
  jumpToCrumb,
  handleTopPaneSelect,
  handleMove,
  setDeletingCard,
  drafts,
  savingDraft,
  addDraft,
  updateDraft,
  updateDraftBody,
  cancelDraft,
  saveDraft,
  editor,
  onBackToSubjects,
  onBackToTopics,
}) {
  const crumbs = [
    { label: "Root", isRoot: true },
    ...path.map((id) => ({ label: findNode(tree, id)?.title || "Untitled" })),
  ];

  return (
    <div style={styles.page}>
      <AnimationStyles />
      <div style={styles.container}>
        <div style={styles.topNavCrumb}>
          <button style={styles.backLink} onClick={onBackToSubjects}>
            {subjectName || "Subject"}
          </button>
          {" › "}
          <button style={styles.backLink} onClick={onBackToTopics}>
            {topicName || "Topic"}
          </button>
        </div>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Card Platform</div>
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

        {path.length === 0 && (
          <>
            {!loading && tree.length === 0 && !error && (
              <div style={styles.empty}>
                Nothing here yet. Add the first card below.
              </div>
            )}
            <div key="root" className="pane-animate" style={styles.topPaneList}>
              {tree.map((card, i) => (
                <CardRow
                  key={card.id}
                  card={card}
                  index={i}
                  onSelect={drillInto}
                  onMove={handleMove}
                  onRequestDelete={setDeletingCard}
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
                  saving={savingDraft}
                />
              ))}
            <div style={styles.addButtonWrap}>
              <button style={styles.addButton} onClick={() => addDraft(null)}>
                <span style={styles.plusGlyph}>+</span> Add card
              </button>
            </div>
          </>
        )}

        {path.length > 0 && activeCard && (
          <>
            {parentCard && (
              <div style={styles.parentCard} onClick={goUpOne}>
                <div style={styles.parentCardLabel}>Container</div>
                <div style={styles.parentCardTitle}>
                  {parentCard.title || "Untitled"}
                </div>
                {parentCard.body && (
                  <div style={styles.parentCardBody}>
                    {renderBlocks(parentCard.body)}
                  </div>
                )}
              </div>
            )}
            <div
              key={`level-${path.length === 1 ? "root" : path[path.length - 2]}-${activeId}`}
              className="pane-animate"
              style={styles.topPaneList}
            >
              {topPaneList.map((card, i) =>
                card.id === activeId && editor.showExpanded ? (
                  <div
                    key={card.id}
                    style={styles.bottomPane}
                    className={
                      editor.isClosing ? "pane-closing" : "pane-animate"
                    }
                  >
                    <div
                      style={styles.activeHeaderRow}
                      onClick={editor.toggleActiveExpanded}
                    >
                      <span style={styles.rowTab}>
                        {String(i + 1).padStart(3, "0")}
                      </span>
                      {editor.isEditingActive ? (
                        <input
                          ref={editor.titleRef}
                          style={styles.activeHeaderTitleInput}
                          value={editor.titleDraft}
                          onChange={(e) => editor.setTitleDraft(e.target.value)}
                          placeholder="Untitled"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span style={styles.activeHeaderTitle}>
                          {activeCard.title || "Untitled"}
                        </span>
                      )}
                      <KebabMenu
                        actions={[
                          ...(!editor.isEditingActive
                            ? [
                                {
                                  label: "Edit",
                                  onClick: () =>
                                    editor.setIsEditingActive(true),
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
                            onClick: () => setDeletingCard(activeCard),
                            danger: true,
                          },
                        ]}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: editor.isClosing ? "0fr" : "1fr",
                        transition: "grid-template-rows 220ms ease-in-out",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        {editor.isEditingActive ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              {editor.blocksDraft.map((b) => (
                                <BlockRow
                                  key={b.id}
                                  block={b}
                                  autoFocus={editor.focusBlockId === b.id}
                                  onFocused={() => editor.setFocusBlockId(null)}
                                  onChange={editor.handleBodyChange}
                                  onEnter={editor.handleBodyEnter}
                                  onTypeChange={editor.handleBodyTypeChange}
                                  onBackspaceEmpty={
                                    editor.handleBodyBackspaceEmpty
                                  }
                                />
                              ))}
                            </div>
                            <div style={styles.saveBar}>
                              <button
                                style={styles.btnGhost}
                                onClick={editor.handleCancelActiveEdit}
                              >
                                Cancel
                              </button>
                              <button
                                style={styles.btnPrimary}
                                onClick={editor.handleSaveActive}
                                disabled={editor.saving}
                              >
                                {editor.saving ? "Saving…" : "Save"}
                              </button>
                            </div>
                          </>
                        ) : (
                          <div>{renderBlocks(activeCard.body)}</div>
                        )}

                        <div style={styles.divider} />
                        <div style={styles.sectionLabel}>Nested cards</div>
                        <div style={styles.childrenList}>
                          {(activeCard.children || []).length === 0 && (
                            <div style={styles.emptyChildren}>
                              No nested cards yet.
                            </div>
                          )}
                          {(activeCard.children || []).map((child, ci) => (
                            <CardRow
                              key={child.id}
                              card={child}
                              index={ci}
                              onSelect={drillInto}
                              onMove={handleMove}
                              onRequestDelete={setDeletingCard}
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
                              saving={savingDraft}
                            />
                          ))}
                        <div style={styles.addButtonWrap}>
                          <button
                            style={styles.addButton}
                            onClick={() => addDraft(activeId)}
                          >
                            <span style={styles.plusGlyph}>+</span> Add nested
                            card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <CardRow
                    key={card.id}
                    card={card}
                    index={i}
                    onSelect={
                      card.id === activeId
                        ? () => editor.setIsExpanded(true)
                        : handleTopPaneSelect
                    }
                    onMove={handleMove}
                    onRequestDelete={setDeletingCard}
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
                    saving={savingDraft}
                  />
                ))}
              <div style={styles.addButtonWrap}>
                <button
                  style={styles.addButton}
                  onClick={() =>
                    addDraft(path.length === 1 ? null : path[path.length - 2])
                  }
                >
                  <span style={styles.plusGlyph}>+</span> Add card
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
