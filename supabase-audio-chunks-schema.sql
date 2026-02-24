-- Audio Chunks Table
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS audio_chunks (
  id            text PRIMARY KEY,
  interview_id  text NOT NULL,
  chunk_index   integer NOT NULL,

  -- 오디오 원본
  storage_path  text,
  mime_type     text NOT NULL,
  sample_rate   integer DEFAULT 48000,
  channels      integer DEFAULT 1,
  bitrate       integer DEFAULT 32000,
  duration_sec  real,
  file_size     integer,

  -- Whisper 결과
  transcript    text,
  language      text,
  segments      jsonb,
  whisper_model text DEFAULT 'whisper-1',

  -- 매핑
  message_index integer,
  speaker_label text DEFAULT 'interviewee',

  -- 코퍼스 품질
  is_verified   boolean DEFAULT false,

  -- 메타
  created_at    timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audio_chunks_interview ON audio_chunks(interview_id);
CREATE INDEX IF NOT EXISTS idx_audio_chunks_language ON audio_chunks(language);

-- Foreign key constraint (optional, if interviews table exists)
-- ALTER TABLE audio_chunks ADD CONSTRAINT fk_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE;

-- Note: Create 'audio-chunks' Storage bucket manually in Supabase Dashboard (Settings > Storage)
-- Bucket should be private, no public access.
