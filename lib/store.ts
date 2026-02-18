import { promises as fs } from 'fs';
import path from 'path';
import { Interview } from './types';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'interviews')
  : path.join(process.cwd(), 'data', 'interviews');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function saveInterview(interview: Interview): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${interview.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(interview, null, 2), 'utf-8');
}

export async function getInterview(id: string): Promise<Interview | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as Interview;
  } catch {
    return null;
  }
}

export async function updateInterview(
  id: string,
  updates: Partial<Interview>
): Promise<Interview | null> {
  const interview = await getInterview(id);
  if (!interview) return null;
  const updated = { ...interview, ...updates };
  await saveInterview(updated);
  return updated;
}
