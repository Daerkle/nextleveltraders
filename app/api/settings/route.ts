import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

type SettingsUpdate = {
  theme?: 'light' | 'dark' | 'system';
  defaultSymbol?: string;
  showPivots?: boolean;
  showNews?: boolean;
};

// GET: Benutzereinstellungen abrufen
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

    // Einstellungen abrufen oder Standardeinstellungen erstellen
    let settings = await prisma.settings.findUnique({
      where: {
        userId,
      },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId,
          theme: 'system',
          defaultSymbol: 'AAPL',
          showPivots: true,
          showNews: true,
        },
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Fehler beim Abrufen der Einstellungen:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// PATCH: Benutzereinstellungen aktualisieren
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

    const updates = await request.json();
    const validUpdates: SettingsUpdate = {};

    if ('theme' in updates && typeof updates.theme === 'string') {
      if (['light', 'dark', 'system'].includes(updates.theme)) {
        validUpdates.theme = updates.theme as 'light' | 'dark' | 'system';
      }
    }

    if ('defaultSymbol' in updates && typeof updates.defaultSymbol === 'string') {
      validUpdates.defaultSymbol = updates.defaultSymbol.toUpperCase();
    }

    if ('showPivots' in updates && typeof updates.showPivots === 'boolean') {
      validUpdates.showPivots = updates.showPivots;
    }

    if ('showNews' in updates && typeof updates.showNews === 'boolean') {
      validUpdates.showNews = updates.showNews;
    }

    // Einstellungen aktualisieren oder erstellen
    const settings = await prisma.settings.upsert({
      where: {
        userId,
      },
      update: {
        ...validUpdates,
        updatedAt: new Date(),
      },
      create: {
        userId,
        theme: validUpdates.theme || 'system',
        defaultSymbol: validUpdates.defaultSymbol || 'AAPL',
        showPivots: validUpdates.showPivots ?? true,
        showNews: validUpdates.showNews ?? true,
      },
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Einstellungen:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}