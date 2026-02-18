/**
 * lib/store.ts — Supabase 기반 인터뷰 스토리지
 *
 * 필요한 Supabase 테이블 (SQL):
 *   create table interviews (
 *     id text primary key,
 *     data jsonb not null,
 *     created_at timestamptz default now()
 *   );
 *
 * 환경변수:
 *   SUPABASE_URL          — Project URL (Settings > API)
 *   SUPABASE_SERVICE_ROLE_KEY — service_role secret (RLS 우회)
 */

import { supabase } from './supabase';
import { Interview } from './types';

export async function saveInterview(interview: Interview): Promise<void> {
  const { error } = await supabase
    .from('interviews')
    .upsert({ id: interview.id, data: interview }, { onConflict: 'id' });
  if (error) throw new Error(`saveInterview failed: ${error.message}`);
}

export async function getInterview(id: string): Promise<Interview | null> {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('data')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data.data as Interview;
  } catch {
    return null;
  }
}

export async function updateInterview(
  id: string,
  updates: Partial<Interview>,
): Promise<Interview | null> {
  const interview = await getInterview(id);
  if (!interview) return null;
  const updated = { ...interview, ...updates };
  await saveInterview(updated);
  return updated;
}
