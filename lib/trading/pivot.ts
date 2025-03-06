/**
 * Pivot-Punkt-Berechnungsmodule für NextLevelTraders
 * 
 * Dieses Modul implementiert verschiedene Pivot-Punkt-Berechnungen wie in den
 * Anforderungen spezifiziert, einschließlich Standard-Pivots und DeMark-Pivots.
 */

export type OHLC = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type PivotLevels = {
  PP: number;
  R1?: number;
  R2?: number;
  R3?: number;
  R4?: number;
  R5?: number;
  S1?: number;
  S2?: number;
  S3?: number;
  S4?: number;
  S5?: number;
};

export type PivotHistory = {
  [level: string]: {
    hit: boolean;
    hit_above: boolean;
    hit_below: boolean;
  };
};

export type PivotStatus = {
  status: string;
  color: string;
  distance: string;
  currentPrice: number;
};

/**
 * Berechnet Standard-Pivot-Punkte
 */
export function calculateStandardPivots(ohlc: OHLC): PivotLevels {
  // Pivot Point
  const pivot = (ohlc.high + ohlc.low + ohlc.close) / 3;

  // Resistance & Support Levels
  const r1 = (pivot * 2) - ohlc.low;
  const r2 = pivot + (ohlc.high - ohlc.low);
  const r3 = r1 + (ohlc.high - ohlc.low);
  const r4 = r2 + (ohlc.high - ohlc.low);
  const r5 = r3 + (ohlc.high - ohlc.low);

  const s1 = (pivot * 2) - ohlc.high;
  const s2 = pivot - (ohlc.high - ohlc.low);
  const s3 = s1 - (ohlc.high - ohlc.low);
  const s4 = s2 - (ohlc.high - ohlc.low);
  const s5 = s3 - (ohlc.high - ohlc.low);

  return {
    PP: pivot,
    R1: r1,
    R2: r2,
    R3: r3,
    R4: r4,
    R5: r5,
    S1: s1,
    S2: s2,
    S3: s3,
    S4: s4,
    S5: s5
  };
}

/**
 * Berechnet DeMark-Pivot-Punkte
 */
export function calculateDeMarkPivots(ohlc: OHLC): PivotLevels {
  let x: number;
  
  // X-Wert basierend auf Close vs. Open
  if (ohlc.close > ohlc.open) {
    x = (ohlc.high + (ohlc.low * 2) + ohlc.close);
  } else if (ohlc.close < ohlc.open) {
    x = ((ohlc.high * 2) + ohlc.low + ohlc.close);
  } else {
    x = (ohlc.high + ohlc.low + (ohlc.close * 2));
  }

  // Pivot Point
  const pivot = x / 4;

  // Resistance & Support
  const r1 = x / 2 - ohlc.low;
  const s1 = x / 2 - ohlc.high;

  return {
    PP: pivot,
    R1: r1,
    S1: s1
  };
}

/**
 * Überprüft den Status des Pivot-Punkts
 */
export function checkPivotStatus(currentPrice: number, pivotLevel: number): PivotStatus {
  // Berechne die prozentuale Entfernung zum Pivot
  const distance = ((currentPrice - pivotLevel) / pivotLevel) * 100;
  
  // Bestimme den Status und die Farbe basierend auf der Position zum Pivot
  let status: string;
  let color: string;
  
  if (Math.abs(distance) <= 0.1) {  // Innerhalb von 0.1%
    status = "Am Pivot";
    color = "#6B7280";  // Grau
  } else if (distance > 0) {
    status = "Über Pivot";
    color = "#22C55E";  // Grün
  } else {
    status = "Unter Pivot";
    color = "#EF4444";  // Rot
  }
      
  return {
    status,
    color,
    distance: `${distance.toFixed(2)}%`,
    currentPrice
  };
}

/**
 * Überprüft historische Levels für Treffer (vereinfachte Version)
 */
export function checkHistoricalLevels(
  recentData: OHLC[], 
  levels: PivotLevels
): PivotHistory {
  const result: PivotHistory = {};
  
  for (const [levelName, levelValue] of Object.entries(levels)) {
    let hitsAbove = false;
    let hitsBelow = false;
    
    // Überprüfe, ob der Level getroffen wurde
    for (const bar of recentData) {
      if (bar.low <= levelValue && bar.high > levelValue) {
        hitsAbove = true;
      }
      
      if (bar.high >= levelValue && bar.low < levelValue) {
        hitsBelow = true;
      }
    }
    
    result[levelName] = {
      hit: hitsAbove || hitsBelow,
      hit_above: hitsAbove,
      hit_below: hitsBelow
    };
  }
  
  return result;
}

/**
 * Analysiert einen Zeitrahmen und berechnet beide Arten von Pivot-Punkten
 */
export function analyzeTimeframe(
  data: OHLC[]
): {
  standard: {
    levels: PivotLevels;
    history: PivotHistory;
    status: PivotStatus;
  };
  demark: {
    levels: PivotLevels;
    history: PivotHistory;
  };
} {
  if (!data || data.length === 0) {
    throw new Error("Keine Daten verfügbar für die Analyse");
  }

  // Hole den letzten Handelstag
  const lastBar = data[data.length - 1];
  const previousBars = data.slice(-6, -1); // Nimm die letzten 5 Bars (ohne die aktuelle)
  
  // Pivot-Punkte berechnen
  const standardLevels = calculateStandardPivots(lastBar);
  const demarkLevels = calculateDeMarkPivots(lastBar);

  // Historische Überprüfung
  const standardHistory = checkHistoricalLevels(previousBars, standardLevels);
  const demarkHistory = checkHistoricalLevels(previousBars, demarkLevels);

  // Pivot Status
  const pivotStatus = checkPivotStatus(lastBar.close, standardLevels.PP);

  return {
    standard: {
      levels: standardLevels,
      history: standardHistory,
      status: pivotStatus
    },
    demark: {
      levels: demarkLevels,
      history: demarkHistory
    }
  };
}