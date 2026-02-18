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
import { Interview } from './types';

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
