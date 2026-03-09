import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get('event');

    if (!eventName) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

     const baseUrl = process.env.FETCH_EVENT_NAME || process.env.NEXT_PUBLIC_FETCH_EVENT_NAME;

    if (!baseUrl) {
      return NextResponse.json(
        { error: 'FETCH_EVENT_NAME base URL is not configured' },
        { status: 500 }
      );
    }

     const apiUrl = `${baseUrl}/${encodeURIComponent(eventName)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch appointments (${response.status}): ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Events API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}


