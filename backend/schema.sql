-- Full schema for a fresh database: subjects -> topics -> cards.

-- ---- Subjects ----
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- Topics ----
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_topics_subject_id ON topics (subject_id);

-- ---- Cards ----
-- Hierarchical cards, adjacency-list style, scoped to a topic.
-- parent_id = NULL means the card lives at the root level of its topic.
-- topic_id is nullable: some cards predate topics and have NULL here.
CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE
);

-- Speeds up "give me all children of this card" lookups.
CREATE INDEX IF NOT EXISTS idx_cards_parent_id ON cards (parent_id);
CREATE INDEX IF NOT EXISTS idx_cards_topic_id ON cards (topic_id);
