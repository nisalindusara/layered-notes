import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Turns the flat rows from Postgres into the nested shape the frontend wants.
function buildTree(rows) {
  const byId = new Map();
  rows.forEach((row) => {
    byId.set(row.id, {
      id: row.id,
      title: row.title,
      body: row.body,
      children: [],
    });
  });

  const roots = [];
  rows.forEach((row) => {
    const node = byId.get(row.id);
    if (row.parent_id === null) {
      roots.push(node);
    } else {
      const parent = byId.get(row.parent_id);
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  });

  return roots;
}

// Topic-scoped: siblings are only ever compared within the same topic,
// so reordering never interleaves cards from different topics.
async function getSiblingIds(client, parentId, topicId, excludeId = null) {
  const query = excludeId
    ? `SELECT id FROM cards WHERE parent_id IS NOT DISTINCT FROM $1 AND topic_id = $2 AND id != $3 ORDER BY sort_order ASC, id ASC`
    : `SELECT id FROM cards WHERE parent_id IS NOT DISTINCT FROM $1 AND topic_id = $2 ORDER BY sort_order ASC, id ASC`;
  const params = excludeId
    ? [parentId, topicId, excludeId]
    : [parentId, topicId];
  const { rows } = await client.query(query, params);
  return rows.map((r) => r.id);
}

async function renumberList(client, orderedIds) {
  for (let i = 0; i < orderedIds.length; i++) {
    await client.query("UPDATE cards SET sort_order = $1 WHERE id = $2", [
      i,
      orderedIds[i],
    ]);
  }
}

// ---- Subjects ----

app.get("/api/subjects", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name FROM subjects ORDER BY id ASC",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load subjects" });
  }
});

app.post("/api/subjects", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO subjects (name) VALUES ($1) RETURNING id, name",
      [name.trim()],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// ---- Topics ----

app.get("/api/subjects/:subjectId/topics", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, subject_id, name FROM topics WHERE subject_id = $1 ORDER BY id ASC",
      [req.params.subjectId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load topics" });
  }
});

app.post("/api/subjects/:subjectId/topics", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO topics (subject_id, name) VALUES ($1, $2) RETURNING id, subject_id, name",
      [req.params.subjectId, name.trim()],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create topic" });
  }
});

// ---- Cards (scoped to a topic) ----

app.get("/api/cards", async (req, res) => {
  const { topicId } = req.query;
  if (!topicId) {
    return res
      .status(400)
      .json({ error: "topicId query parameter is required" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT id, parent_id, title, body FROM cards WHERE topic_id = $1 ORDER BY sort_order ASC, id ASC",
      [topicId],
    );
    res.json(buildTree(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load cards" });
  }
});

app.post("/api/cards", async (req, res) => {
  const { title, body, parentId, topicId } = req.body;
  let finalTopicId = topicId;

  try {
    if (parentId !== null && parentId !== undefined) {
      const { rows: parentRows } = await pool.query(
        "SELECT topic_id FROM cards WHERE id = $1",
        [parentId],
      );
      if (parentRows.length === 0) {
        return res.status(400).json({ error: "Parent card not found" });
      }
      finalTopicId = parentRows[0].topic_id;
    }

    if (!finalTopicId) {
      return res.status(400).json({ error: "topicId is required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO cards (parent_id, title, body, sort_order, topic_id)
       VALUES ($1, $2, $3, (
          SELECT COALESCE(MAX(sort_order), -1) + 1 FROM cards
          WHERE parent_id IS NOT DISTINCT FROM $1 AND topic_id = $4
        ), $4)
       RETURNING id, parent_id, title, body`,
      [
        parentId ?? null,
        title && title.trim() ? title.trim() : "Untitled",
        body ? body.trim() : "",
        finalTopicId,
      ],
    );
    const row = rows[0];
    res.status(201).json({
      id: row.id,
      title: row.title,
      body: row.body,
      children: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create card" });
  }
});

app.patch("/api/cards/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE cards
       SET title = $1, body = $2
       WHERE id = $3
       RETURNING id, parent_id, title, body`,
      [
        title && title.trim() ? title.trim() : "Untitled",
        body ? body.trim() : "",
        id,
      ],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

app.post("/api/cards/:id/move-up", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT parent_id, topic_id FROM cards WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Card not found" };

    const order = await getSiblingIds(
      client,
      rows[0].parent_id,
      rows[0].topic_id,
    );
    const idx = order.indexOf(id);
    if (idx > 0) {
      [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      await renumberList(client, order);
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to move card" });
  } finally {
    client.release();
  }
});

app.post("/api/cards/:id/move-down", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT parent_id, topic_id FROM cards WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Card not found" };

    const order = await getSiblingIds(
      client,
      rows[0].parent_id,
      rows[0].topic_id,
    );
    const idx = order.indexOf(id);
    if (idx !== -1 && idx < order.length - 1) {
      [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      await renumberList(client, order);
    }
    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to move card" });
  } finally {
    client.release();
  }
});

app.post("/api/cards/:id/outdent", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id, parent_id, topic_id FROM cards WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Card not found" };
    const card = rows[0];

    if (card.parent_id === null) {
      await client.query("ROLLBACK");
      return res.json({ ok: true, note: "Already at the top level" });
    }

    const { rows: parentRows } = await client.query(
      "SELECT id, parent_id FROM cards WHERE id = $1",
      [card.parent_id],
    );
    const parent = parentRows[0];
    const grandparentId = parent.parent_id;

    const oldSiblingIds = await getSiblingIds(
      client,
      card.parent_id,
      card.topic_id,
      id,
    );
    await renumberList(client, oldSiblingIds);

    const newSiblingIds = await getSiblingIds(
      client,
      grandparentId,
      card.topic_id,
      id,
    );
    const parentIndex = newSiblingIds.indexOf(parent.id);
    newSiblingIds.splice(parentIndex + 1, 0, id);

    await client.query("UPDATE cards SET parent_id = $1 WHERE id = $2", [
      grandparentId,
      id,
    ]);
    await renumberList(client, newSiblingIds);

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to outdent card" });
  } finally {
    client.release();
  }
});

app.post("/api/cards/:id/indent", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id, parent_id, topic_id FROM cards WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Card not found" };
    const card = rows[0];

    const fullOrder = await getSiblingIds(
      client,
      card.parent_id,
      card.topic_id,
    );
    const myIndex = fullOrder.indexOf(id);

    if (myIndex <= 0) {
      await client.query("ROLLBACK");
      return res.json({ ok: true, note: "No preceding sibling to nest under" });
    }

    const newParentId = fullOrder[myIndex - 1];
    const remainingOldSiblings = fullOrder.filter((x) => x !== id);
    await renumberList(client, remainingOldSiblings);

    const newSiblingIds = await getSiblingIds(
      client,
      newParentId,
      card.topic_id,
      id,
    );
    newSiblingIds.push(id);

    await client.query("UPDATE cards SET parent_id = $1 WHERE id = $2", [
      newParentId,
      id,
    ]);
    await renumberList(client, newSiblingIds);

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Failed to indent card" });
  } finally {
    client.release();
  }
});

app.delete("/api/cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      "DELETE FROM cards WHERE id = $1 RETURNING id",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
});

// Serve the built frontend, and fall back to it for any non-API route
// so refreshing the page (or opening any path) still loads the app.
app.use(express.static(frontendDistPath));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

const PORT = process.env.PORT || 4000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Card platform API listening on port ${PORT}`);
  });
}

export default app;
