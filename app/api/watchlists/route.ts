import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { getQuotes } from '@/lib/fmp';

// GET: Alle Watchlists des Benutzers abrufen mit Echtzeit-Marktdaten
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const watchlists = await prisma.watchlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Sammle alle einzigartigen Symbole aus allen Watchlists
    const symbols = [...new Set(watchlists.flatMap(w => w.items.map(item => item.symbol)))];
    
    // Hole Echtzeit-Marktdaten für alle Symbole
    const quotes = await getQuotes(symbols);
    const quotesMap = new Map(quotes.map(quote => [quote.symbol, quote]));

    // Füge Marktdaten zu den Watchlists hinzu
    const watchlistsWithQuotes = watchlists.map(watchlist => ({
      ...watchlist,
      items: watchlist.items.map(item => ({
        ...item,
        quote: quotesMap.get(item.symbol) || null
      }))
    }));

    return NextResponse.json({ data: watchlistsWithQuotes });
  } catch (error) {
    console.error('Fehler beim Abrufen der Watchlists:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// POST: Neue Watchlist erstellen
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name ist erforderlich' },
        { status: 400 }
      );
    }

    // Überprüfen, ob bereits eine Watchlist mit diesem Namen existiert
    const existingWatchlist = await prisma.watchlist.findFirst({
      where: {
        userId: userId,
        name: name,
      },
    });

    if (existingWatchlist) {
      return NextResponse.json(
        { error: 'Eine Watchlist mit diesem Namen existiert bereits' },
        { status: 400 }
      );
    }

    // Neue Watchlist erstellen
    const watchlist = await prisma.watchlist.create({
      data: {
        name,
        userId,
        items: {
          create: [], // Startet mit einer leeren Liste von Symbolen
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ data: watchlist }, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen der Watchlist:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}