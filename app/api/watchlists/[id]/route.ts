import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET: Eine einzelne Watchlist abrufen
export async function GET(
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

    const watchlist = await prisma.watchlist.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: true,
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

    return NextResponse.json({ data: watchlist });
  } catch (error) {
    console.error('Fehler beim Abrufen der Watchlist:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// PATCH: Eine Watchlist aktualisieren
export async function PATCH(
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

    const { name } = await request.json();

    const updatedWatchlist = await prisma.watchlist.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ data: updatedWatchlist });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Watchlist:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// DELETE: Eine Watchlist löschen
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

    await prisma.watchlist.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Watchlist erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Löschen der Watchlist:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}