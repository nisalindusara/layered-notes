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

app.get("/api/blocks", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, parent_id, title, body FROM blocks ORDER BY id ASC",
    );
    res.json(buildTree(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load blocks" });
  }
});

app.post("/api/blocks", async (req, res) => {
  const { title, body, parentId } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO blocks (parent_id, title, body)
       VALUES ($1, $2, $3)
       RETURNING id, parent_id, title, body`,
      [parentId ?? null, title.trim(), body ? body.trim() : ""],
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
      [title.trim(), body ? body.trim() : "", id],
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Block platform API listening on port ${PORT}`);
});
