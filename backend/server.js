import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

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
      // If the parent row is missing for some reason, fall back to root
      // rather than silently dropping the block.
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  });

  return roots;
}

async function getSiblingIds(client, parentId, excludeId = null) {
  const query = excludeId
    ? `SELECT id FROM blocks WHERE parent_id IS NOT DISTINCT FROM $1 AND id != $2 ORDER BY sort_order ASC, id ASC`
    : `SELECT id FROM blocks WHERE parent_id IS NOT DISTINCT FROM $1 ORDER BY sort_order ASC, id ASC`;
  const { rows } = await client.query(
    query,
    excludeId ? [parentId, excludeId] : [parentId],
  );
  return rows.map((r) => r.id);
}

async function renumberList(client, orderedIds) {
  for (let i = 0; i < orderedIds.length; i++) {
    await client.query("UPDATE blocks SET sort_order = $1 WHERE id = $2", [
      i,
      orderedIds[i],
    ]);
  }
}

app.get("/api/blocks", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, parent_id, title, body FROM blocks ORDER BY sort_order ASC, id ASC",
    );
    res.json(buildTree(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load blocks" });
  }
});

app.post("/api/blocks", async (req, res) => {
  const { title, body, parentId } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO blocks (parent_id, title, body, sort_order)
       VALUES ($1, $2, $3, (
          SELECT COALESCE(MAX(sort_order), -1) + 1 FROM blocks WHERE parent_id IS NOT DISTINCT FROM $1
        ))
       RETURNING id, parent_id, title, body`,
      [
        parentId ?? null,
        title && title.trim() ? title.trim() : "Untitled",
        body ? body.trim() : "",
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
    res.status(500).json({ error: "Failed to create block" });
  }
});

app.patch("/api/blocks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE blocks
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
      return res.status(404).json({ error: "Block not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update block" });
  }
});

app.post("/api/blocks/:id/move-up", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT parent_id FROM blocks WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Block not found" };

    const order = await getSiblingIds(client, rows[0].parent_id);
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
      .json({ error: err.message || "Failed to move block" });
  } finally {
    client.release();
  }
});

app.post("/api/blocks/:id/move-down", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT parent_id FROM blocks WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Block not found" };

    const order = await getSiblingIds(client, rows[0].parent_id);
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
      .json({ error: err.message || "Failed to move block" });
  } finally {
    client.release();
  }
});

app.post("/api/blocks/:id/outdent", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id, parent_id FROM blocks WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Block not found" };
    const block = rows[0];

    if (block.parent_id === null) {
      await client.query("ROLLBACK");
      return res.json({ ok: true, note: "Already at the top level" });
    }

    const { rows: parentRows } = await client.query(
      "SELECT id, parent_id FROM blocks WHERE id = $1",
      [block.parent_id],
    );
    const parent = parentRows[0];
    const grandparentId = parent.parent_id;

    const oldSiblingIds = await getSiblingIds(client, block.parent_id, id);
    await renumberList(client, oldSiblingIds);

    const newSiblingIds = await getSiblingIds(client, grandparentId, id);
    const parentIndex = newSiblingIds.indexOf(parent.id);
    newSiblingIds.splice(parentIndex + 1, 0, id);

    await client.query("UPDATE blocks SET parent_id = $1 WHERE id = $2", [
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
      .json({ error: err.message || "Failed to outdent block" });
  } finally {
    client.release();
  }
});

app.post("/api/blocks/:id/indent", async (req, res) => {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id, parent_id FROM blocks WHERE id = $1",
      [id],
    );
    if (rows.length === 0) throw { status: 404, message: "Block not found" };
    const block = rows[0];

    const fullOrder = await getSiblingIds(client, block.parent_id);
    const myIndex = fullOrder.indexOf(id);

    if (myIndex <= 0) {
      await client.query("ROLLBACK");
      return res.json({ ok: true, note: "No preceding sibling to nest under" });
    }

    const newParentId = fullOrder[myIndex - 1];
    const remainingOldSiblings = fullOrder.filter((x) => x !== id);
    await renumberList(client, remainingOldSiblings);

    const newSiblingIds = await getSiblingIds(client, newParentId, id);
    newSiblingIds.push(id);

    await client.query("UPDATE blocks SET parent_id = $1 WHERE id = $2", [
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
      .json({ error: err.message || "Failed to indent block" });
  } finally {
    client.release();
  }
});

app.delete("/api/blocks/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { rows } = await pool.query(
      "DELETE FROM blocks WHERE id = $1 RETURNING id",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Block not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete block" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Block platform API listening on port ${PORT}`);
});
