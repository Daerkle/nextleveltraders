/**
 * EMA Cloud Trendmodul für NextLevelTraders
 * 
 * Dieses Modul implementiert die EMA-Cloud-basierte Trendanalyse, wie sie in den
 * Anforderungen spezifiziert wurde.
 */

import { OHLC } from "./pivot";

export type EMACloudConfig = {
  shortEMA1: number;
  longEMA1: number;
  shortEMA2: number;
  longEMA2: number;
  // Optionale zusätzliche Parameter
  maType?: "EMA" | "SMA";
};

export type EMACloudStatus = {
  cloud1: {
    bullish: boolean;
    crossover: boolean;
    crossunder: boolean;
  };
  cloud2: {
    bullish: boolean;
    crossover: boolean;
    crossunder: boolean;
  };
  overall: {
    bullish: boolean;
    strength: number; // 0-100
  };
};

export type MultiframeStatus = {
  tenMin: EMACloudStatus;
  oneHour: EMACloudStatus;
  setupConfirmed: boolean;
  direction: "bullish" | "bearish" | "neutral";
};

/**
 * Berechnet einen EMA (Exponential Moving Average)
 */
function calculateEMA(data: number[], length: number): number[] {
  const k = 2 / (length + 1);
  const emaData: number[] = [];
  
  // Erste EMA ist gleich dem SMA
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += data[i];
  }
  emaData.push(sum / length);
  
  // Berechne EMA für die restlichen Punkte
  for (let i = length; i < data.length; i++) {
    emaData.push(data[i] * k + emaData[emaData.length - 1] * (1 - k));
  }
  
  return emaData;
}

/**
 * Berechnet einen SMA (Simple Moving Average)
 */
function calculateSMA(data: number[], length: number): number[] {
  const smaData: number[] = [];
  
  for (let i = 0; i < data.length - length + 1; i++) {
    let sum = 0;
    for (let j = 0; j < length; j++) {
      sum += data[i + j];
    }
    smaData.push(sum / length);
  }
  
  return smaData;
}

/**
 * Berechnet einen MA (Moving Average) basierend auf dem angegebenen Typ
 */
function calculateMA(data: number[], length: number, type: "EMA" | "SMA" = "EMA"): number[] {
  if (type === "EMA") {
    return calculateEMA(data, length);
  } else {
    return calculateSMA(data, length);
  }
}

/**
 * Überprüft, ob ein Crossover stattgefunden hat
 */
function hasCrossover(shortMA: number[], longMA: number[], index: number): boolean {
  if (index <= 0 || index >= shortMA.length) return false;
  return shortMA[index - 1] <= longMA[index - 1] && shortMA[index] > longMA[index];
}

/**
 * Überprüft, ob ein Crossunder stattgefunden hat
 */
function hasCrossunder(shortMA: number[], longMA: number[], index: number): boolean {
  if (index <= 0 || index >= shortMA.length) return false;
  return shortMA[index - 1] >= longMA[index - 1] && shortMA[index] < longMA[index];
}

/**
 * Analysiert die EMA-Cloud für einen bestimmten Datensatz
 */
export function analyzeEMACloud(
  ohlcData: OHLC[],
  config: EMACloudConfig = {
    shortEMA1: 5,
    longEMA1: 12,
    shortEMA2: 34,
    longEMA2: 50,
    maType: "EMA"
  }
): EMACloudStatus {
  if (!ohlcData || ohlcData.length === 0) {
    throw new Error("Keine Daten verfügbar für die Analyse");
  }
  
  // Extrahiere die Close-Werte für die MA-Berechnung
  const closeData = ohlcData.map(bar => bar.close);
  
  // Berechne die MAs für beide Clouds
  const shortEMA1 = calculateMA(closeData, config.shortEMA1, config.maType);
  const longEMA1 = calculateMA(closeData, config.longEMA1, config.maType);
  const shortEMA2 = calculateMA(closeData, config.shortEMA2, config.maType);
  const longEMA2 = calculateMA(closeData, config.longEMA2, config.maType);
  
  // Aktueller Index für die Analyse
  const currentIndex = shortEMA1.length - 1;
  
  // Cloud 1 Status (kurzfristig)
  const cloud1Bullish = shortEMA1[currentIndex] > longEMA1[currentIndex];
  const cloud1Crossover = hasCrossover(shortEMA1, longEMA1, currentIndex);
  const cloud1Crossunder = hasCrossunder(shortEMA1, longEMA1, currentIndex);
  
  // Cloud 2 Status (längerfristig)
  const cloud2Bullish = shortEMA2[currentIndex] > longEMA2[currentIndex];
  const cloud2Crossover = hasCrossover(shortEMA2, longEMA2, currentIndex);
  const cloud2Crossunder = hasCrossunder(shortEMA2, longEMA2, currentIndex);
  
  // Gesamtstatus
  const bothBullish = cloud1Bullish && cloud2Bullish;
  const bothBearish = !cloud1Bullish && !cloud2Bullish;
  
  // Stärke berechnen (ein einfacher Algorithmus)
  let strength = 50; // Neutral
  
  if (bothBullish) {
    // Berechne die Stärke basierend auf Abstand zwischen den MAs
    const cloud1Diff = shortEMA1[currentIndex] - longEMA1[currentIndex];
    const cloud2Diff = shortEMA2[currentIndex] - longEMA2[currentIndex];
    const normalizedDiff = (cloud1Diff / longEMA1[currentIndex] + cloud2Diff / longEMA2[currentIndex]) / 2;
    
    strength = 50 + Math.min(normalizedDiff * 500, 50); // Max 100
  } else if (bothBearish) {
    // Berechne die Stärke basierend auf Abstand zwischen den MAs
    const cloud1Diff = longEMA1[currentIndex] - shortEMA1[currentIndex];
    const cloud2Diff = longEMA2[currentIndex] - shortEMA2[currentIndex];
    const normalizedDiff = (cloud1Diff / longEMA1[currentIndex] + cloud2Diff / longEMA2[currentIndex]) / 2;
    
    strength = 50 - Math.min(normalizedDiff * 500, 50); // Min 0
  } else {
    // Gemischter Trend, leicht abweichend von 50 basierend auf der kurzfristigen Cloud
    strength = cloud1Bullish ? 60 : 40;
  }
  
  return {
    cloud1: {
      bullish: cloud1Bullish,
      crossover: cloud1Crossover,
      crossunder: cloud1Crossunder
    },
    cloud2: {
      bullish: cloud2Bullish,
      crossover: cloud2Crossover,
      crossunder: cloud2Crossunder
    },
    overall: {
      bullish: bothBullish || (cloud1Bullish && cloud2Bullish),
      strength
    }
  };
}

/**
 * Führt eine Multiframe-Analyse durch, basierend auf 10-Minuten- und 1-Stunden-Daten
 */
export function analyzeMultiframe(
  tenMinData: OHLC[],
  oneHourData: OHLC[],
  config?: EMACloudConfig
): MultiframeStatus {
  // Analysiere beide Zeitrahmen
  const tenMinStatus = analyzeEMACloud(tenMinData, config);
  const oneHourStatus = analyzeEMACloud(oneHourData, config);
  
  // Bestimme, ob das Setup bestätigt ist
  const bullishSetup = tenMinStatus.overall.bullish && oneHourStatus.overall.bullish;
  const bearishSetup = !tenMinStatus.overall.bullish && !oneHourStatus.overall.bullish;
  const setupConfirmed = bullishSetup || bearishSetup;
  
  // Bestimme die Richtung
  let direction: "bullish" | "bearish" | "neutral" = "neutral";
  
  if (bullishSetup) {
    direction = "bullish";
  } else if (bearishSetup) {
    direction = "bearish";
  }
  
  return {
    tenMin: tenMinStatus,
    oneHour: oneHourStatus,
    setupConfirmed,
    direction
  };
}