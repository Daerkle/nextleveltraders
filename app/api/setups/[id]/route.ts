import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET: Einzelnes Trading-Setup abrufen
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

    const setup = await prisma.tradingSetup.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!setup) {
      return NextResponse.json(
        { error: 'Setup nicht gefunden' },
        { status: 404 }
      );
    }

    if (setup.userId !== userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: setup });
  } catch (error) {
    console.error('Fehler beim Abrufen des Trading-Setups:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// DELETE: Trading-Setup löschen
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

    const setup = await prisma.tradingSetup.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!setup) {
      return NextResponse.json(
        { error: 'Setup nicht gefunden' },
        { status: 404 }
      );
    }

    if (setup.userId !== userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
      );
    }

    await prisma.tradingSetup.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Setup erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Löschen des Trading-Setups:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}