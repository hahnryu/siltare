-- Reserve columns for user-corrected transcripts
-- Implementation: Post Parents' Day (May 8) DB refactoring

ALTER TABLE audio_chunks
  ADD COLUMN IF NOT EXISTS transcript_corrected text,
  ADD COLUMN IF NOT EXISTS transcript_corrected_at timestamptz;

COMMENT ON COLUMN audio_chunks.transcript IS 'Whisper raw output. Never overwrite.';
COMMENT ON COLUMN audio_chunks.transcript_corrected IS 'User-corrected transcript. Filled later.';
COMMENT ON COLUMN audio_chunks.transcript_corrected_at IS 'Timestamp of user correction.';

-- Data value:
-- 1. Korean voice correction dataset (elderly speech + dialect + colloquial)
-- 2. Provenance chain: audio -> Whisper raw -> user correction
-- 3. Personalized STT possibility (learn individual correction patterns)
