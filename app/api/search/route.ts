import { searchSymbol } from '@/lib/fmp';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const results = await searchSymbol(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching symbols:', error);
    return NextResponse.json({ error: 'Failed to search symbols' }, { status: 500 });
  }
}
