# Pivot-System Optimierung

## Kernprobleme

1. **Berechnungsprobleme**
- Inkonsistente Implementierungen zwischen Dateien
- Unterschiedliche Level-Definitionen (R1-R5 vs R1-R3)

2. **Performance-Probleme**
- Ineffiziente Zeitrahmen-Berechnung
- Fehlende Pivot-Integration in Trading-Setups

## Optimierter Lösungsansatz

### 1. Vereinheitlichte Pivot-Berechnung

```typescript
// Vereinfachte Konfiguration
interface PivotConfig {
  method: 'standard' | 'demark';
  levels: 3 | 5;  // Nur 3 oder 5 Levels erlaubt
}

// Optimierte Struktur
interface PivotPoints {
  pp: number;
  r1: number;
  r2: number;
  r3: number;
  r4?: number;
  r5?: number;
  s1: number;
  s2: number;
  s3: number;
  s4?: number;
  s5?: number;
}
```

### 2. Performante Timeframe-Integration

```typescript
type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d';

class PivotCalculator {
  // Schnelle Berechnung durch Map
  private cache = new Map<string, PivotPoints>();
  
  calculate(data: HistoricalPrice[], timeframe: Timeframe): PivotPoints {
    const key = this.getCacheKey(data, timeframe);
    if (this.cache.has(key)) return this.cache.get(key)!;
    
    const pivots = this.computePivots(data, timeframe);
    this.cache.set(key, pivots);
    return pivots;
  }
}
```

### 3. Optimierte UI-Integration

```typescript
interface PivotDisplay {
  level: keyof PivotPoints;
  price: number;
  distance: number;
  signal: 'support' | 'resistance' | 'neutral';
}

// Vereinfachte Chart-Konfiguration
interface PivotChartConfig {
  showLevels: boolean;
  highlightActive: boolean;
  labels: boolean;
}
```

### 4. Trading-Integration

```typescript
interface PivotSetup {
  entry: PivotDisplay;
  stop: PivotDisplay;
  target: PivotDisplay;
  ratio: number;
}
```

## Schnelle Implementierung

### Phase 1: Basis (3-4 Tage)
1. Zentrale Pivot-Berechnung implementieren
2. Basis-Tests erstellen
3. Cache-System einrichten

### Phase 2: UI (2-3 Tage)
1. Chart-Integration optimieren
2. Setup-Tabelle erweitern
3. Performance-Monitoring

### Phase 3: Trading (2-3 Tage)
1. Setup-Erkennung implementieren
2. Risk/Reward Integration
3. Live-Tests

## Neue Dateistruktur

```
lib/
  ├── pivots/
  │   ├── calculator.ts     # Hauptlogik
  │   ├── types.ts         # Interfaces
  │   └── utils.ts         # Hilfsfunktionen
  └── trading/
      └── setup.ts         # Trading Integration
```

## Performance-Ziele

1. **Berechnung**
- < 10ms für Pivot-Berechnung
- < 50ms für Chart-Rendering
- < 100ms für Setup-Analyse

2. **Speicher**
- Max 100KB Cache-Größe
- Automatische Cache-Bereinigung

## Nächste Schritte

1. Implementierung der optimierten Pivot-Berechnung
2. Schnelle Integration in bestehende UI
3. Trading-System Anbindung
4. Performance-Tests