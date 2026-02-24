/**
 * lib/store.ts — Supabase 기반 인터뷰 스토리지
 *
 * 필요한 Supabase 테이블 (SQL):
 *   create table interviews (
 *     id           text primary key,
 *     mode         text,
 *     status       text,
 *     requester    jsonb,
 *     interviewee  jsonb,
 *     context      jsonb,
 *     context2     text,
 *     messages     jsonb,
 *     transcript   text,
 *     summary      text,
 *     entities     jsonb,
 *     created_at   timestamptz default now(),
 *     updated_at   timestamptz
 *   );
 *
 * 환경변수:
 *   SUPABASE_URL              — Project URL (Settings > API)
 *   SUPABASE_SERVICE_ROLE_KEY — service_role secret (RLS 우회)
 */

import { supabase } from './supabase';
import { Interview, AudioChunk } from './types';

export async function createInterview(interview: Interview): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .insert({
      id: interview.id,
      mode: interview.mode,
      status: interview.status,
      requester: interview.requester,
      interviewee: interview.interviewee,
      context: interview.context,
      context2: interview.context2,
      messages: interview.messages,
      transcript: interview.transcript,
      summary: interview.summary,
      entities: interview.entities,
    });
  if (error) throw new Error(`createInterview failed: ${error.message}`);
}

export async function getInterview(id: string): Promise<Interview | null> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return rowToInterview(data);
}

export async function updateInterview(id: string, updates: Partial<Interview>): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(`updateInterview failed: ${error.message}`);
}

export async function getAllInterviews(): Promise<Interview[]> {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getAllInterviews failed: ${error.message}`);
  return (data || []).map(rowToInterview);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToInterview(row: any): Interview {
  return {
    id: row.id,
    mode: row.mode,
    status: row.status,
    requester: row.requester,
    interviewee: row.interviewee,
    context: row.context,
    context2: row.context2,
    messages: row.messages || [],
    transcript: row.transcript,
    summary: row.summary,
    entities: row.entities,
    createdAt: row.created_at,
  };
}

// ========== AudioChunk CRUD ==========

export async function createAudioChunk(chunk: AudioChunk): Promise<void> {
  const { error } = await supabase.from('audio_chunks').insert({
    id: chunk.id,
    interview_id: chunk.interviewId,
    chunk_index: chunk.chunkIndex,
    storage_path: chunk.storagePath,
    mime_type: chunk.mimeType,
    sample_rate: chunk.sampleRate,
    channels: chunk.channels,
    bitrate: chunk.bitrate,
    duration_sec: chunk.durationSec,
    file_size: chunk.fileSize,
    transcript: chunk.transcript,
    language: chunk.language,
    segments: chunk.segments,
    whisper_model: chunk.whisperModel,
    message_index: chunk.messageIndex,
    speaker_label: chunk.speakerLabel,
    is_verified: chunk.isVerified,
  });
  if (error) throw new Error(`createAudioChunk failed: ${error.message}`);
}

export async function getAudioChunks(interviewId: string): Promise<AudioChunk[]> {
  const { data, error } = await supabase
    .from('audio_chunks')
    .select('*')
    .eq('interview_id', interviewId)
    .order('chunk_index', { ascending: true });
  if (error) throw new Error(`getAudioChunks failed: ${error.message}`);
  return (data || []).map(rowToAudioChunk);
}

export async function updateAudioChunk(id: string, updates: Partial<AudioChunk>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.storagePath !== undefined) payload.storage_path = updates.storagePath;
  if (updates.transcript !== undefined) payload.transcript = updates.transcript;
  if (updates.language !== undefined) payload.language = updates.language;
  if (updates.segments !== undefined) payload.segments = updates.segments;
  if (updates.isVerified !== undefined) payload.is_verified = updates.isVerified;
  if (updates.messageIndex !== undefined) payload.message_index = updates.messageIndex;

  const { error } = await supabase
    .from('audio_chunks')
    .update(payload)
    .eq('id', id);
  if (error) throw new Error(`updateAudioChunk failed: ${error.message}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAudioChunk(row: any): AudioChunk {
  return {
    id: row.id,
    interviewId: row.interview_id,
    chunkIndex: row.chunk_index,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sampleRate: row.sample_rate,
    channels: row.channels,
    bitrate: row.bitrate,
    durationSec: row.duration_sec,
    fileSize: row.file_size,
    transcript: row.transcript,
    language: row.language,
    segments: row.segments,
    whisperModel: row.whisper_model,
    messageIndex: row.message_index,
    speakerLabel: row.speaker_label,
    isVerified: row.is_verified,
    createdAt: row.created_at,
  };
}
