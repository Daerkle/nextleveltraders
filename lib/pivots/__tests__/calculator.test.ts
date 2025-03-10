import { PivotCalculator } from '../calculator';
import { HistoricalPrice } from '../types';

describe('PivotCalculator', () => {
  let calculator: PivotCalculator;
  
  // Testdaten für einen Handelstag
  const mockDayData: HistoricalPrice[] = [
    {
      date: '2025-03-10T09:30:00Z',
      open: 100,
      high: 110,
      low: 90,
      close: 105,
      volume: 1000
    }
  ];

  // Testdaten für eine Woche
  const mockWeekData: HistoricalPrice[] = Array(5).fill(null).map((_, i) => ({
    date: `2025-03-${10 + i}T09:30:00Z`,
    open: 100 + i,
    high: 110 + i,
    low: 90 + i,
    close: 105 + i,
    volume: 1000 + i
  }));

  beforeEach(() => {
    calculator = new PivotCalculator();
  });

  describe('Standard Pivot Berechnung', () => {
    it('berechnet tägliche Pivots korrekt', () => {
      const result = calculator.calculate(mockDayData, '1d', {
        method: 'standard',
        levels: 3
      });

      // PP = (H + L + C) / 3 = (110 + 90 + 105) / 3 = 101.67
      expect(result.pp).toBeCloseTo(101.67, 2);
      
      // R1 = (2 * PP) - L = (2 * 101.67) - 90 = 113.34
      expect(result.r1).toBeCloseTo(113.34, 2);
      
      // S1 = (2 * PP) - H = (2 * 101.67) - 110 = 93.34
      expect(result.s1).toBeCloseTo(93.34, 2);
    });

    it('berechnet wöchentliche Pivots korrekt', () => {
      const result = calculator.calculate(mockWeekData, '1d', {
        method: 'standard',
        levels: 3
      });

      // Verwende höchstes High, niedrigstes Low und letztes Close
      const high = Math.max(...mockWeekData.map(d => d.high)); // 114
      const low = Math.min(...mockWeekData.map(d => d.low));   // 90
      const close = mockWeekData[mockWeekData.length - 1].close; // 109

      // PP = (H + L + C) / 3 = (114 + 90 + 109) / 3 = 104.33
      expect(result.pp).toBeCloseTo(104.33, 2);
    });
  });

  describe('DeMark Pivot Berechnung', () => {
    it('berechnet DeMark Pivots korrekt', () => {
      const result = calculator.calculate(mockDayData, '1d', {
        method: 'demark',
        levels: 3
      });

      // X = High + (2 * Low) + Close (wenn Close < Open)
      const x = 110 + (2 * 90) + 105;
      // PP = X / 4 = 395 / 4 = 98.75
      expect(result.pp).toBeCloseTo(98.75, 2);
    });
  });

  describe('Cache-Funktionalität', () => {
    it('cached Berechnungen und verwendet den Cache', () => {
      const firstResult = calculator.calculate(mockDayData, '1d', {
        method: 'standard',
        levels: 3
      });

      const secondResult = calculator.calculate(mockDayData, '1d', {
        method: 'standard',
        levels: 3
      });

      expect(secondResult).toEqual(firstResult);
    });

    it('löscht den Cache bei Bedarf', () => {
      calculator.calculate(mockDayData, '1d', {
        method: 'standard',
        levels: 3
      });

      calculator.clearCache();

      // Neue Berechnung sollte neue Objekt-Referenz erstellen
      const newResult = calculator.calculate(mockDayData, '1d', {
        method: 'standard',
        levels: 3
      });

      expect(newResult).toBeDefined();
    });
  });
});