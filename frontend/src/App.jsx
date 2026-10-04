import React, { useState, useEffect } from "react";
import SubjectsView from "./components/subjects/SubjectsView";
import TopicsView from "./components/topics/TopicsView";
import TopicContentView from "./components/cards/TopicContentView";
import ConfirmDeleteDialog from "./components/common/ConfirmDeleteDialog";
import { fetchSubjects, createSubject } from "./api/subjectsApi";
import { fetchTopics, createTopic } from "./api/topicsApi";
import { useCardTree } from "./hooks/useCardTree";
import { useActiveCardEditor } from "./hooks/useActiveCardEditor";
import { useDrafts } from "./hooks/useDrafts";

export default function CardPlatform() {
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

  const cardTree = useCardTree({ topicId: selectedTopicId, setError });
  const editor = useActiveCardEditor({
    activeId: cardTree.activeId,
    activeCard: cardTree.activeCard,
    setTree: cardTree.setTree,
    setError,
  });
  const draftsHook = useDrafts({
    topicId: selectedTopicId,
    setTree: cardTree.setTree,
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
    cardTree.setPath([]);
    cardTree.setTree([]);
    setView("cards");
  };

  const backToSubjects = () => {
    setView("subjects");
    setSelectedSubjectId(null);
    setSelectedTopicId(null);
    setTopics([]);
    cardTree.setPath([]);
    cardTree.setTree([]);
  };

  const backToTopics = () => {
    setView("topics");
    setSelectedTopicId(null);
    cardTree.setPath([]);
    cardTree.setTree([]);
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
        loading={cardTree.loading}
        tree={cardTree.tree}
        path={cardTree.path}
        activeId={cardTree.activeId}
        activeCard={cardTree.activeCard}
        parentCard={cardTree.parentCard}
        topPaneList={cardTree.topPaneList}
        drillInto={cardTree.drillInto}
        goUpOne={cardTree.goUpOne}
        goToRoot={cardTree.goToRoot}
        jumpToCrumb={cardTree.jumpToCrumb}
        handleTopPaneSelect={cardTree.handleTopPaneSelect}
        handleMove={cardTree.handleMove}
        setDeletingCard={cardTree.setDeletingCard}
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
      {cardTree.deletingCard && (
        <ConfirmDeleteDialog
          card={cardTree.deletingCard}
          deleting={cardTree.deleting}
          onConfirm={cardTree.handleDeleteConfirmed}
          onCancel={() => cardTree.setDeletingCard(null)}
        />
      )}
    </>
  );
}
