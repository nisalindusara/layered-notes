-- Migration: rename table "blocks" -> "cards"
-- Written 2026-10-04. NOT applied automatically — review, then run by hand
-- in the Supabase SQL Editor.
--
-- Deploy order: the new backend queries "cards" and the old one queries
-- "blocks", so run this migration and deploy the new code back-to-back.
-- In between, API calls will fail with a 500 (nothing is corrupted — each
-- failed query just errors out).
--
-- What follows the rename automatically (Postgres tracks these by OID, not
-- by name): all rows, the id sequence/default, the primary key, the
-- self-referencing parent_id foreign key, the topic_id foreign key, indexes,
-- RLS policies, grants, and triggers.
-- What does NOT follow it: function bodies that mention "blocks" by name.
-- Pre-flight check 2 below finds those.

-- ===========================================================================
-- PRE-FLIGHT (read-only) — run these first and check the output.
-- ===========================================================================

-- 1. Expect exactly one row: public | blocks. If "cards" already exists, stop.
-- SELECT table_schema, table_name
-- FROM information_schema.tables
-- WHERE table_name IN ('blocks', 'cards');

-- 2. Expect zero rows. Any rows are functions that reference "blocks" by
--    name and would need updating separately.
-- SELECT p.proname
-- FROM pg_proc p
-- JOIN pg_namespace n ON n.oid = p.pronamespace
-- WHERE n.nspname = 'public' AND p.prosrc ILIKE '%blocks%';

-- 3. (Optional) See the current constraint/index/sequence names, which the
--    cosmetic renames below will change.
-- SELECT conname FROM pg_constraint WHERE conrelid = 'public.blocks'::regclass;
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'blocks';
-- SELECT pg_get_serial_sequence('public.blocks', 'id');

-- ===========================================================================
-- MIGRATION
-- ===========================================================================

BEGIN;

-- The actual rename. This is the only statement the app depends on.
ALTER TABLE public.blocks RENAME TO cards;

-- Cosmetic: rename attached objects whose names still say "blocks" so they
-- match the new table name. Looks up real names from the catalog instead of
-- assuming them, so it's safe even if the live names differ from schema.sql.
DO $$
DECLARE
  r record;
BEGIN
  -- Constraints (primary key, foreign keys, etc.). Renaming the primary key
  -- constraint also renames its backing index.
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.cards'::regclass
      AND conname LIKE '%blocks%'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.cards RENAME CONSTRAINT %I TO %I',
      r.conname, replace(r.conname, 'blocks', 'cards')
    );
  END LOOP;

  -- Remaining indexes (e.g. idx_blocks_parent_id).
  FOR r IN
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'cards'
      AND indexname LIKE '%blocks%'
  LOOP
    EXECUTE format(
      'ALTER INDEX public.%I RENAME TO %I',
      r.indexname, replace(r.indexname, 'blocks', 'cards')
    );
  END LOOP;
END $$;

-- The SERIAL sequence. The column default references it by OID, so this is
-- cosmetic too.
ALTER SEQUENCE IF EXISTS public.blocks_id_seq RENAME TO cards_id_seq;

COMMIT;

-- ===========================================================================
-- VERIFY (read-only)
-- ===========================================================================
-- SELECT count(*) FROM public.cards;    -- same row count as blocks had
-- SELECT conname FROM pg_constraint WHERE conrelid = 'public.cards'::regclass;
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'cards';
-- SELECT pg_get_serial_sequence('public.cards', 'id');

-- ===========================================================================
-- ROLLBACK (only if you need to revert; pair it with redeploying the old
-- backend code)
-- ===========================================================================
-- BEGIN;
-- ALTER TABLE public.cards RENAME TO blocks;
-- DO $$
-- DECLARE r record;
-- BEGIN
--   FOR r IN SELECT conname FROM pg_constraint
--            WHERE conrelid = 'public.blocks'::regclass AND conname LIKE '%cards%'
--   LOOP
--     EXECUTE format('ALTER TABLE public.blocks RENAME CONSTRAINT %I TO %I',
--                    r.conname, replace(r.conname, 'cards', 'blocks'));
--   END LOOP;
--   FOR r IN SELECT indexname FROM pg_indexes
--            WHERE schemaname = 'public' AND tablename = 'blocks' AND indexname LIKE '%cards%'
--   LOOP
--     EXECUTE format('ALTER INDEX public.%I RENAME TO %I',
--                    r.indexname, replace(r.indexname, 'cards', 'blocks'));
--   END LOOP;
-- END $$;
-- ALTER SEQUENCE IF EXISTS public.cards_id_seq RENAME TO blocks_id_seq;
-- COMMIT;
