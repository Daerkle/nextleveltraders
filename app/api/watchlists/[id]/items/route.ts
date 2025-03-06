import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getQuotes } from '@/lib/fmp';

// POST: Symbol zur Watchlist hinzufügen
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { symbol } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol ist erforderlich' },
        { status: 400 }
      );
    }

    // Überprüfen, ob das Symbol gültig ist
    const quotes = await getQuotes([symbol]);
    if (!quotes.length) {
      return NextResponse.json(
        { error: 'Ungültiges Symbol' },
        { status: 400 }
      );
    }

    // Überprüfen, ob die Watchlist dem Benutzer gehört
    const watchlist = await prisma.watchlist.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist nicht gefunden' },
        { status: 404 }
      );
    }

    // Symbol zur Watchlist hinzufügen
    const item = await prisma.watchlistItem.create({
      data: {
        symbol: symbol.toUpperCase(),
        watchlistId: params.id,
      },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Symbol existiert bereits in dieser Watchlist' },
        { status: 400 }
      );
    }

    console.error('Fehler beim Hinzufügen des Symbols:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// DELETE: Symbol aus Watchlist entfernen
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol ist erforderlich' },
        { status: 400 }
      );
    }

    // Überprüfen, ob die Watchlist dem Benutzer gehört
    const watchlist = await prisma.watchlist.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist nicht gefunden' },
        { status: 404 }
      );
    }

    // Symbol aus der Watchlist entfernen
    await prisma.watchlistItem.deleteMany({
      where: {
        watchlistId: params.id,
        symbol: symbol.toUpperCase(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Entfernen des Symbols:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
