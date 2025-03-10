# Pivot-System Optimierungen

## Übersicht der Verbesserungen

### 1. Zeitfenster-Berechnung
- Präzise Berechnung für verschiedene Timeframes (5m bis 1d)
- Korrekte Perioden-Aggregation pro Timeframe
- Optimierte Berechnung der High/Low/Open/Close-Werte
- Unterstützung für:
  - Intraday (5min, 15min, 1h)
  - Daily (4h, 1d)
  - Weekly
  - Monthly

### 2. Pivot-Berechnung
- Exakte Berechnungen für jeden Zeitrahmen
- Standard und DeMark Methoden
- Flexible Level-Anzahl (3 oder 5)
- Berücksichtigung des gesamten relevanten Zeitraums

### 3. Performance-Optimierungen
- Intelligentes Caching-System
- Effiziente Datenstrukturen
- Vermeidung von Redundanzen
- Optimierte Speichernutzung

### 4. Konfigurationsoptionen

#### Timeframes
```typescript
type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d';
```

#### Pivot-Typen
```typescript
type PivotType = 'intraday' | 'daily' | 'weekly' | 'monthly';
```

#### Konfiguration
```typescript
interface TimeframeConfig {
  periodsToAnalyze: number;    // Anzahl der zu analysierenden Perioden
  pivotType: PivotType;        // Art der Pivot-Berechnung
  periodsBack: number;         // Rückblickende Perioden
  levelsToShow: 3 | 5;        // Anzahl der Pivot-Levels
}
```

### 5. Berechnungsperioden

#### Intraday
- 5min: 78 Kerzen (6.5 Handelsstunden)
- 15min: 26 Kerzen
- 1h: 7 Kerzen
- 4h: 2 Kerzen

#### Daily
- 5min: 390 Kerzen (ein Handelstag)
- 15min: 130 Kerzen
- 1h: 24 Kerzen
- 4h: 6 Kerzen
- 1d: 1 Kerze

#### Weekly
- 5min: 1950 Kerzen (eine Handelswoche)
- 15min: 650 Kerzen
- 1h: 120 Kerzen
- 4h: 30 Kerzen
- 1d: 5 Kerzen

#### Monthly
- 5min: 8190 Kerzen (ein Handelsmonat)
- 15min: 2730 Kerzen
- 1h: 504 Kerzen
- 4h: 126 Kerzen
- 1d: 21 Kerzen

## Verwendung

### Standard-Pivots
```typescript
const calculator = new PivotCalculator();
const pivots = calculator.calculate(data, '1d', {
  method: 'standard',
  levels: 5
});
```

### DeMark-Pivots
```typescript
const pivots = calculator.calculate(data, '1d', {
  method: 'demark',
  levels: 3
});
```

### Analyse der Pivot-Levels
```typescript
const levels = calculator.analyzePivotLevels(pivots, currentPrice);
console.log(levels);
// [
//   { level: 'pp', price: 100, distance: 0, signal: 'neutral' },
//   { level: 'r1', price: 105, distance: 5, signal: 'resistance' },
//   { level: 's1', price: 95, distance: -5, signal: 'support' }
// ]
```

## Tests

Die Implementierung ist durch umfangreiche Tests abgesichert:
- Unit-Tests für alle Berechnungsmethoden
- Validierung der Zeitfenster-Logik
- Cache-Funktionalitätstests
- Edge-Case-Prüfungen

## Zukünftige Verbesserungen

1. Zusätzliche Pivot-Methoden
   - Fibonacci Pivots
   - Camarilla Pivots
   - Woodie's Pivots

2. Erweiterte Analysemöglichkeiten
   - Trendstärke-Indikatoren
   - Pivot-Cluster-Erkennung
   - Multi-Timeframe-Analyse

3. Performance-Optimierungen
   - Worker-Thread-Unterstützung
   - Verbesserte Cache-Strategien
   - Real-time Updates