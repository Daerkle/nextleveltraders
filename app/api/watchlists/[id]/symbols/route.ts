import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// POST: Symbol zu einer Watchlist hinzufügen
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

    // Prüfen, ob die Watchlist existiert und dem Benutzer gehört
    const watchlist = await prisma.watchlist.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist nicht gefunden' },
        { status: 404 }
      );
    }

    if (watchlist.userId !== userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
      );
    }

    const { symbol } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol ist erforderlich' },
        { status: 400 }
      );
    }

    // Symbol zur Watchlist hinzufügen
    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        symbol: symbol.toUpperCase(),
        watchlistId: params.id,
      },
    });

    return NextResponse.json({ data: watchlistItem });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
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

// DELETE: Symbol aus einer Watchlist entfernen
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

    // Prüfen, ob die Watchlist existiert und dem Benutzer gehört
    const watchlist = await prisma.watchlist.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Watchlist nicht gefunden' },
        { status: 404 }
      );
    }

    if (watchlist.userId !== userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
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

    // Symbol aus der Watchlist entfernen
    await prisma.watchlistItem.deleteMany({
      where: {
        watchlistId: params.id,
        symbol: symbol.toUpperCase(),
      },
    });

    return NextResponse.json(
      { message: 'Symbol erfolgreich entfernt' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Entfernen des Symbols:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}