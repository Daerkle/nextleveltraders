import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// GET: Trading-Setups abrufen
export async function GET(request: Request) {
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
    const status = searchParams.get('status');
    const symbol = searchParams.get('symbol');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter erstellen
    const where = {
      userId,
      ...(status && { status: status.toUpperCase() }),
      ...(symbol && { symbol: symbol.toUpperCase() }),
    };

    // Setups abrufen
    const setups = await prisma.tradingSetup.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Gesamtanzahl der Setups
    const total = await prisma.tradingSetup.count({ where });

    return NextResponse.json({
      data: setups,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Trading-Setups:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// POST: Neues Trading-Setup erstellen
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

    const { symbol, timeframe, type, entry, stopLoss, takeProfit, notes } = await request.json();

    // Validierung
    if (!symbol || !timeframe || !type || !entry || !stopLoss || !takeProfit) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      );
    }

    if (!['LONG', 'SHORT'].includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Ungültiger Setup-Typ' },
        { status: 400 }
      );
    }

    // Setup erstellen
    const setup = await prisma.tradingSetup.create({
      data: {
        userId,
        symbol: symbol.toUpperCase(),
        timeframe,
        type: type.toUpperCase(),
        entry: parseFloat(entry),
        stopLoss: parseFloat(stopLoss),
        takeProfit: parseFloat(takeProfit),
        notes,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ data: setup }, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Trading-Setups:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// PATCH: Trading-Setup aktualisieren (z.B. Status oder Ergebnis)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { id, status, result } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Setup-ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Prüfen, ob das Setup existiert und dem Benutzer gehört
    const existingSetup = await prisma.tradingSetup.findUnique({
      where: { id },
    });

    if (!existingSetup) {
      return NextResponse.json(
        { error: 'Setup nicht gefunden' },
        { status: 404 }
      );
    }

    if (existingSetup.userId !== userId) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 403 }
      );
    }

    // Setup aktualisieren
    const updatedSetup = await prisma.tradingSetup.update({
      where: { id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(result !== undefined && { result: parseFloat(result) }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updatedSetup });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Trading-Setups:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}