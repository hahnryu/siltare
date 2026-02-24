// TODO: add auth check here
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAudioChunks } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { chunkId: string } }
) {
  try {
    const { chunkId } = params;

    // Get chunk metadata from DB
    const { data: chunkData, error: dbError } = await supabase
      .from('audio_chunks')
      .select('storage_path, mime_type')
      .eq('id', chunkId)
      .single();

    if (dbError || !chunkData || !chunkData.storage_path) {
      return NextResponse.json({ error: 'Chunk not found' }, { status: 404 });
    }

    // Download from Supabase Storage
    const { data: audioData, error: storageError } = await supabase.storage
      .from('audio-chunks')
      .download(chunkData.storage_path);

    if (storageError || !audioData) {
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
    }

    // Stream audio file
    const buffer = await audioData.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': chunkData.mime_type || 'audio/webm',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
