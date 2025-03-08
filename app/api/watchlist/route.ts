import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { redisGet, redisSet, getUserWatchlistKey } from "@/lib/redis";

// Import the improved Redis client functions

// GET: Hole die Watchlist eines Benutzers
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const auth = getAuth(request);
    const userId = auth.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Watchlist aus Redis abrufen
    const key = getUserWatchlistKey(userId);
    const watchlistData = await redisGet(key);
    
    // Verbesserte Fehlerbehandlung für JSON-Parsing
    let watchlist = { items: [] };
    if (watchlistData) {
      try {
        watchlist = JSON.parse(watchlistData);
        console.log('Watchlist erfolgreich aus Redis geladen:', {
          userId,
          itemCount: watchlist.items?.length || 0
        });
      } catch (parseError) {
        console.error('Fehler beim Parsen der Watchlist-Daten:', parseError);
        console.log('Problematische Daten:', watchlistData);
      }
    } else {
      console.log('Keine Watchlist-Daten in Redis gefunden für:', userId);
    }

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Fehler beim Abrufen der Watchlist:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// POST: Aktualisiere die Watchlist eines Benutzers
export async function POST(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const auth = getAuth(request);
    const userId = auth.userId;
    if (!userId) {
      console.error('Watchlist API: Benutzer nicht authentifiziert');
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Daten aus dem Request-Body lesen
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      console.error('Watchlist API: Ungültiges Format', JSON.stringify(body));
      return NextResponse.json(
        { error: "Ungültiges Format: 'items' muss ein Array sein" },
        { status: 400 }
      );
    }

    // Stelle sicher, dass alle Items ein gültiges Symbol haben
    const validItems = items.filter(item => item && item.symbol && typeof item.symbol === 'string');
    console.log(`Watchlist API: Speichere ${validItems.length} gültige Symbole für Benutzer ${userId}`);

    // Watchlist in Redis speichern
    const key = getUserWatchlistKey(userId);
    const watchlist = {
      id: userId,
      name: "Standard",
      items: validItems,
      updatedAt: new Date().toISOString(),
    };

    try {
      const success = await redisSet(key, JSON.stringify(watchlist));
      if (success) {
        console.log(`Watchlist API: Erfolgreich in Redis gespeichert unter Schlüssel ${key}`, {
          userId,
          itemCount: validItems.length
        });
      } else {
        console.error("Watchlist API: Speichern in Redis fehlgeschlagen");
        return NextResponse.json(
          { error: "Fehler beim Speichern der Watchlist" },
          { status: 500 }
        );
      }
    } catch (redisError) {
      console.error("Fehler beim Speichern der Watchlist in Redis:", redisError);
      return NextResponse.json(
        { error: "Fehler beim Speichern der Watchlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Watchlist erfolgreich aktualisiert",
      watchlist,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Watchlist:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// DELETE: Entferne ein Symbol aus der Watchlist
export async function DELETE(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const auth = getAuth(request);
    const userId = auth.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Symbol aus der URL abrufen
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol muss angegeben werden" },
        { status: 400 }
      );
    }

    // Aktuelle Watchlist abrufen
    const key = getUserWatchlistKey(userId);
    const watchlistData = await redisGet(key);
    
    // Verbesserte Fehlerbehandlung für JSON-Parsing
    let watchlist = { items: [] };
    if (watchlistData) {
      try {
        watchlist = JSON.parse(watchlistData);
        console.log('Watchlist für Löschvorgang geladen:', {
          userId,
          symbol,
          itemCount: watchlist.items?.length || 0
        });
      } catch (parseError) {
        console.error('Fehler beim Parsen der Watchlist-Daten für Löschvorgang:', parseError);
        console.log('Problematische Daten:', watchlistData);
      }
    } else {
      console.log('Keine Watchlist-Daten in Redis gefunden für Löschvorgang:', userId);
    }

    // Symbol aus der Watchlist entfernen
    const updatedItems = Array.isArray(watchlist.items) 
      ? watchlist.items.filter((item: any) => item.symbol !== symbol)
      : [];

    // Aktualisierte Watchlist speichern
    const updatedWatchlist = {
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    try {
      const success = await redisSet(key, JSON.stringify(updatedWatchlist));
      if (success) {
        console.log('Watchlist nach Löschvorgang aktualisiert:', {
          userId,
          symbol,
          newItemCount: updatedItems.length
        });
        
        return NextResponse.json({
          message: "Symbol erfolgreich aus der Watchlist entfernt",
          watchlist: updatedWatchlist,
        });
      } else {
        console.error("Watchlist API: Speichern nach Löschvorgang fehlgeschlagen");
        return NextResponse.json(
          { error: "Fehler beim Aktualisieren der Watchlist" },
          { status: 500 }
        );
      }
    } catch (redisError) {
      console.error("Fehler beim Speichern der aktualisierten Watchlist in Redis:", redisError);
      return NextResponse.json(
        { error: "Fehler beim Aktualisieren der Watchlist" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Fehler beim Entfernen aus der Watchlist:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
