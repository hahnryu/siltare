-- Reserve columns for user-corrected transcripts
-- Implementation: Post Parents' Day (May 8) DB refactoring

ALTER TABLE audio_chunks
  ADD COLUMN IF NOT EXISTS transcript_corrected text,
  ADD COLUMN IF NOT EXISTS transcript_corrected_at timestamptz;
