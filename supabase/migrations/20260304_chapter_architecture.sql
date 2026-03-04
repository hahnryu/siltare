-- Chapter Architecture: Add chapter_context, chapter_map, diagnosis to interviews
-- Add source field to messages
-- Migration date: 2026-03-04

ALTER TABLE interviews
  ADD COLUMN IF NOT EXISTS chapter_context jsonb,
  ADD COLUMN IF NOT EXISTS chapter_map     jsonb,
  ADD COLUMN IF NOT EXISTS diagnosis       jsonb;

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS source text CHECK (source IN ('ai', 'requester_hint'));
