import React, { useState, useEffect } from "react";
import SubjectsView from "./components/subjects/SubjectsView";
import TopicsView from "./components/topics/TopicsView";
import TopicContentView from "./components/blocks/TopicContentView";
import ConfirmDeleteDialog from "./components/common/ConfirmDeleteDialog";
import { fetchSubjects, createSubject } from "./api/subjectsApi";
import { fetchTopics, createTopic } from "./api/topicsApi";
import { useBlockTree } from "./hooks/useBlockTree";
import { useActiveBlockEditor } from "./hooks/useActiveBlockEditor";
import { useDrafts } from "./hooks/useDrafts";

export default function BlockPlatform() {
  const [view, setView] = useState("subjects");
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubjects()
      .then(setSubjects)
      .catch((err) => setError(`Couldn't load subjects: ${err.message}`));
  }, []);

  useEffect(() => {
    if (!selectedSubjectId) return;
    fetchTopics(selectedSubjectId)
      .then(setTopics)
      .catch((err) => setError(`Couldn't load topics: ${err.message}`));
  }, [selectedSubjectId]);

  const blockTree = useBlockTree({ topicId: selectedTopicId, setError });
  const editor = useActiveBlockEditor({
    activeId: blockTree.activeId,
    activeBlock: blockTree.activeBlock,
    setTree: blockTree.setTree,
    setError,
  });
  const draftsHook = useDrafts({
    topicId: selectedTopicId,
    setTree: blockTree.setTree,
    setError,
  });

  const handleCreateSubject = async (name) => {
    try {
      const newSubject = await createSubject(name);
      setSubjects((prev) => [...prev, newSubject]);
    } catch (err) {
      setError(`Couldn't create subject: ${err.message}`);
    }
  };

  const handleCreateTopic = async (name) => {
    try {
      const newTopic = await createTopic(selectedSubjectId, name);
      setTopics((prev) => [...prev, newTopic]);
    } catch (err) {
      setError(`Couldn't create topic: ${err.message}`);
    }
  };

  const enterTopic = (subjectId, topicId) => {
    setSelectedSubjectId(subjectId);
    setSelectedTopicId(topicId);
    blockTree.setPath([]);
    blockTree.setTree([]);
    setView("blocks");
  };

  const backToSubjects = () => {
    setView("subjects");
    setSelectedSubjectId(null);
    setSelectedTopicId(null);
    setTopics([]);
    blockTree.setPath([]);
    blockTree.setTree([]);
  };

  const backToTopics = () => {
    setView("topics");
    setSelectedTopicId(null);
    blockTree.setPath([]);
    blockTree.setTree([]);
  };

  if (view === "subjects") {
    return (
      <SubjectsView
        subjects={subjects}
        onSelectSubject={(id) => {
          setSelectedSubjectId(id);
          setView("topics");
        }}
        onCreateSubject={handleCreateSubject}
      />
    );
  }

  if (view === "topics") {
    const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
    return (
      <TopicsView
        subjectName={currentSubject?.name}
        topics={topics}
        onSelectTopic={(topicId) => enterTopic(selectedSubjectId, topicId)}
        onCreateTopic={handleCreateTopic}
        onBack={backToSubjects}
      />
    );
  }

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <>
      <TopicContentView
        subjectName={currentSubject?.name}
        topicName={currentTopic?.name}
        error={error}
        loading={blockTree.loading}
        tree={blockTree.tree}
        path={blockTree.path}
        activeId={blockTree.activeId}
        activeBlock={blockTree.activeBlock}
        parentBlock={blockTree.parentBlock}
        topPaneList={blockTree.topPaneList}
        drillInto={blockTree.drillInto}
        goUpOne={blockTree.goUpOne}
        goToRoot={blockTree.goToRoot}
        jumpToCrumb={blockTree.jumpToCrumb}
        handleTopPaneSelect={blockTree.handleTopPaneSelect}
        handleMove={blockTree.handleMove}
        setDeletingBlock={blockTree.setDeletingBlock}
        drafts={draftsHook.drafts}
        savingDraft={draftsHook.savingDraft}
        addDraft={draftsHook.addDraft}
        updateDraft={draftsHook.updateDraft}
        updateDraftBody={draftsHook.updateDraftBody}
        cancelDraft={draftsHook.cancelDraft}
        saveDraft={draftsHook.saveDraft}
        editor={editor}
        onBackToSubjects={backToSubjects}
        onBackToTopics={backToTopics}
      />
      {blockTree.deletingBlock && (
        <ConfirmDeleteDialog
          block={blockTree.deletingBlock}
          deleting={blockTree.deleting}
          onConfirm={blockTree.handleDeleteConfirmed}
          onCancel={() => blockTree.setDeletingBlock(null)}
        />
      )}
    </>
  );
}
