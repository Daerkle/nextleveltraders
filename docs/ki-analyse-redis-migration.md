# KI-Analyse Redis Migration

## Problem
Die KI-Analyse-Funktionalität schlägt fehl, da sie noch versucht, Daten in Supabase zu speichern, obwohl wir auf Upstash Redis umgestiegen sind.

## Lösungsplan

### 1. API-Route Anpassung
- Entfernen der Supabase-Integration aus `app/api/market-data/scan/route.ts`
- Implementieren der Redis-Speicherung für Setups
- Schlüsselstruktur: `setups:{symbol}:{timestamp}`

### 2. Datenstruktur
```typescript
interface Setup {
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  target: number;
  riskRewardRatio: number;
  probability: number;
  reason: string;
  timestamp: string;
}
```

### 3. Redis Implementierung
```typescript
// Beispiel für Redis-Speicherung
const setupKey = `setups:${symbol}:${Date.now()}`;
await redisSet(setupKey, JSON.stringify(setup));
// TTL von 24 Stunden setzen
await redisClient.expire(setupKey, 24 * 60 * 60);
```

### 4. Fehlerbehandlung
- Implementierung von Retry-Logik für Market Data Abruf
- Validierung der Datenstruktur vor Redis-Speicherung
- Verbessertes Error Logging

## Nächste Schritte
1. Code-Modus aktivieren
2. API-Route aktualisieren
3. Redis-Integration implementieren
4. Tests durchführen
5. Deployment und Monitoring

## Migration
1. Keine Datenmigration erforderlich, da Setups temporär sind
2. Alte Supabase-Tabelle kann nach erfolgreicher Umstellung gelöscht werden

## Technische Schulden
- [ ] Implementierung von Redis-Cleanup für alte Setups
- [ ] Monitoring für Redis-Speichernutzung
- [ ] Performance-Metriken für Setup-Analyse