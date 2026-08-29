-- Hierarchical blocks, adjacency-list style.
-- parent_id = NULL means the block lives at the root level.
CREATE TABLE IF NOT EXISTS blocks (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES blocks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Speeds up "give me all children of this block" lookups.
CREATE INDEX IF NOT EXISTS idx_blocks_parent_id ON blocks (parent_id);
