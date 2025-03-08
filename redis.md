# Redis-Integration für Watchlist-Funktionalität

## Übersicht
Dieses Dokument beschreibt die Migration der Watchlist-Funktionalität von Supabase zu Redis, um eine zuverlässige geräteübergreifende Speicherung der Watchlist-Symbole zu ermöglichen.

## Bereits umgesetzte Änderungen

### API-Endpunkte
- ✅ Neue API-Route `/api/watchlist` erstellt, die Redis für die Speicherung nutzt
- ✅ GET-Endpunkt implementiert, um die Watchlist eines Benutzers abzurufen
- ✅ POST-Endpunkt implementiert, um die Watchlist eines Benutzers zu aktualisieren
- ✅ DELETE-Endpunkt implementiert, um ein Symbol aus der Watchlist zu entfernen
- ✅ JSON-Serialisierung für Redis-Operationen implementiert

### Komponenten
- ✅ Neuer Redis-basierter Watchlist-Provider erstellt (`watchlist-provider-redis.tsx`)
- ✅ WatchlistSidebar-Komponente angepasst, um mit dem neuen Provider zu arbeiten
- ✅ Watchlist-Store überarbeitet, um Supabase-Abhängigkeiten zu entfernen

## Noch ausstehende Aufgaben

### Komponenten-Migration
- ⬜ Alten Watchlist-Provider vollständig durch den neuen Redis-basierten Provider ersetzen
- ⬜ Verbleibende Supabase-Referenzen im Watchlist-Provider entfernen
- ⬜ Verbleibende Supabase-Referenzen in der EditableWatchlist-Komponente entfernen

### Store-Bereinigung
- ⬜ Verbleibende Supabase-Referenzen im Watchlist-Store entfernen
- ⬜ Nicht mehr benötigte Funktionen und Variablen im Store entfernen (z.B. `watchlistId`)

### Fehlerbehandlung
- ⬜ Verbleibende Typfehler in der API-Route beheben
- ⬜ Verbleibende Typfehler in den Komponenten beheben

### Allgemeine Bereinigung
- ⬜ Nicht mehr benötigte Supabase-Konfigurationsdateien entfernen oder deaktivieren
- ⬜ Nicht mehr benötigte Umgebungsvariablen für Supabase dokumentieren
- ⬜ Testen der gesamten Watchlist-Funktionalität mit Redis

## Technische Details

### Redis-Schlüsselstruktur
- Watchlist-Daten werden unter dem Schlüssel `watchlist:{userId}` gespeichert
- Daten werden als JSON-Objekt mit der folgenden Struktur gespeichert:
  ```json
  {
    "items": [
      { "symbol": "AAPL", "price": 123.45, "change": 1.23 },
      { "symbol": "MSFT", "price": 234.56, "change": -0.45 }
    ],
    "updatedAt": "2025-03-08T13:30:00.000Z"
  }
  ```

### Authentifizierung
- Clerk wird für die Benutzerauthentifizierung verwendet
- Nur authentifizierte Benutzer können auf ihre Watchlist-Daten zugreifen
- Die Benutzer-ID aus Clerk wird verwendet, um den Redis-Schlüssel zu generieren

### Umgebungsvariablen
- `UPSTASH_REDIS_REST_URL`: URL für die Upstash Redis-Instanz
- `UPSTASH_REDIS_REST_TOKEN`: Token für die Authentifizierung bei Upstash Redis

## Vorteile der Redis-Migration
- Vereinfachte Architektur ohne Abhängigkeit von Supabase-Tabellen
- Schnellere Lese- und Schreiboperationen durch Redis
- Zuverlässige geräteübergreifende Synchronisation der Watchlist
- Reduzierte Komplexität durch Entfernung der Supabase-Integration
