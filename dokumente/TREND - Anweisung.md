# EMA Cloud Trendmodul für Multiframe-Analyse

Dieses Dokument beschreibt den Aufbau eines automatisierten Moduls, das mithilfe von EMA‑Wolken (Clouds) den Trend auf 10‑Minuten und 1‑Stunden Charts bestimmt. Die zugrunde liegende Logik basiert auf Crossovers zwischen kurzen und langen EMAs, die als Signal für bullische oder bärische Trendrichtungen gewertet werden.

---

## 1. Zielsetzung

- **Trendbestimmung:**  
  Erkenne, ob der Kurs in einem bullischen (long) oder bärischen (short) Trend liegt, basierend auf EMA-Crossovers.
- **Multiframe-Analyse:**  
  Bestimme den Trend auf Basis von 10‑Minuten- und 1‑Stunden-Daten. Ein Setup gilt als bestätigt, wenn beide Zeitrahmen in die gleiche Richtung weisen.
- **Automatisierte Alerts:**  
  Generiere automatisierte Signale (Alerts) bei Crossovers:
  - **Bullish:** Short EMA kreuzt Long EMA von unten nach oben.
  - **Bearish:** Short EMA kreuzt Long EMA von oben nach unten.

---

## 2. Parameter & Berechnungen

### 2.1 EMA-Berechnung

Verwende als Grundlage den gleitenden Durchschnitt (entweder EMA oder SMA – per Konfiguration wählbar). Die Standard‑Längen im Skript sind:
- **Cloud 1:**  
  - Short EMA: z. B. EMA(5)  
  - Long EMA: z. B. EMA(12)
- **Cloud 2:**  
  - Short EMA: z. B. EMA(34)  
  - Long EMA: z. B. EMA(50)



Die allgemeine Formel für einen EMA (Exponential Moving Average) lautet:
\[
EMA_t = \alpha \cdot \text{Price}_t + (1 - \alpha) \cdot EMA_{t-1}
\]
wobei \(\alpha = \frac{2}{\text{Länge}+1}\) ist.

### 2.2 Wolkenbildung

- **Plotten der EMAs:**  
  Plotte die Short- und Long-EMAs als Linien.
- **Cloud-Füllung:**  
  Fülle den Bereich zwischen Short- und Long-EMA, wobei die Farbe je nach Trendrichtung variiert:
  - **Bullisch:** wenn Short EMA ≥ Long EMA (z. B. grün oder ein anderes positives Farbschema)
  - **Bärisch:** wenn Short EMA < Long EMA (z. B. rot oder ein negatives Farbschema)

Im TradingView-Skript erfolgt dies über die `fill()`-Funktion, wobei Transparenz (z. B. 45 bis 70) angepasst wird.

### 2.3 Crossover-Erkennung

- **Bullisches Signal (Long):**  
  Tritt ein, wenn der Short EMA (z. B. EMA(5)) von unten nach oben den Long EMA (z. B. EMA(12)) schneidet.
- **Bärisches Signal (Short):**  
  Tritt ein, wenn der Short EMA von oben nach unten den Long EMA kreuzt.

Diese Crossovers können mittels der Funktion `crossover(short, long)` bzw. `crossunder(short, long)` in PineScript ermittelt werden.

---

## 3. Multiframe-Integration

### 3.1 Zeitrahmen-Synchronisation

- **10-Minuten-Chart:**  
  Berechne die EMAs (z. B. EMA5, EMA12, EMA34, EMA50) auf Basis der 10‑Minuten-Daten.
- **1‑Stunden-Chart:**  
  Berechne dieselben EMAs auf Basis der 1‑Stunden-Daten.

### 3.2 Setup-Bestätigung

Ein Setup (z. B. Long) gilt als bestätigt, wenn:
- Auf dem 10‑Minuten-Chart ein bullischer Crossover (Short EMA kreuzt Long EMA von unten) vorliegt,
- **und** der 1‑Stunden-Chart denselben Trend (Bullish Cloud) signalisiert.

Analog wird bei Short-Setups verfahren.

*Implementierungshinweis:*  
Vergleiche die Trendrichtung beider Zeitrahmen. Nur bei einer Übereinstimmung wird ein Handelssignal weitergegeben.

---

## 4. Trendfilter: SPY/QQQ Integration (Optional)

Zusätzlich kann der allgemeine Marktzustand über Trendindikatoren (z. B. gleitende Durchschnitte, ADX) von SPY und QQQ berücksichtigt werden:
- **Bullisch:** SPY/QQQ liegen über wichtigen langfristigen EMAs (z. B. 50-Tage, 200-Tage) und der ADX > 25 zeigt einen starken Trend.
- **Seitwärts (Choppy):** Bei ADX < 20.
- **Bearisch:** SPY/QQQ liegen unter den langfristigen EMAs.

Diese Information fließt als zusätzlicher Filter in die Setup-Bestätigung ein.

---

## 5. Automatisierte Signalerzeugung & Alerts

Die Plattform soll basierend auf den EMA-Crossovers automatisch folgende Schritte durchführen:

1. **Berechnung:**  
   - Errechne in Echtzeit die EMAs für beide Zeitrahmen.
   - Fülle die Cloud-Bereiche zur Visualisierung.
2. **Signal-Detektion:**  
   - Überwache Crossovers (crossover()/crossunder()) für jede Cloud.
3. **Multiframe-Check:**  
   - Bestätige ein Setup, wenn beide Zeitrahmen (10 Min & 1H) das gleiche Signal liefern.
4. **Alert-Generierung:**  
   - Bei bestätigten Signalen sende automatisierte Alerts (Long oder Short).
5. **Dokumentation:**  
   - Logge Zeit, Preis und EMAs, um Backtesting und Erfolgsmessung zu ermöglichen.

---

## 6. Beispielcode (TradingView PineScript)

Das folgende Skript (Version 4) bildet die Basis und wird erweitert, um Alerts und Multiframe-Checks zu integrieren:

```pinescript
//@version=4
study("Ripster EMA Clouds", "Ripster EMA Clouds", overlay=true)

// Einstellungen
matype = input(title="MA Type", type=input.string, defval="EMA", options=["EMA", "SMA"])
ma_len1 = input(title="Short EMA1 Length", type=input.integer, defval=8)
ma_len2 = input(title="Long EMA1 Length", type=input.integer, defval=9)
ma_len3 = input(title="Short EMA2 Length", type=input.integer, defval=5)
ma_len4 = input(title="Long EMA2 Length", type=input.integer, defval=12)
ma_len5 = input(title="Short EMA3 Length", type=input.integer, defval=34)
ma_len6 = input(title="Long EMA3 Length", type=input.integer, defval=50)
emacloudleading = input(0, minval=0, title="Leading Period For EMA Cloud")
src = input(title="Source", type=input.source, defval=hl2)
showLine = input(false, title="Display EMA Line")
ema1 = input(true, title="Show EMA Cloud-1")
ema2 = input(true, title="Show EMA Cloud-2")
ema3 = input(true, title="Show EMA Cloud-3")

// EMA Funktion
f_ma(malen) =>
    matype == "EMA" ? ema(src, malen) : sma(src, malen)

// EMA Berechnungen
mashort1 = f_ma(ma_len1)
malong1  = f_ma(ma_len2)
mashort2 = f_ma(ma_len3)
malong2  = f_ma(ma_len4)
mashort3 = f_ma(ma_len5)
malong3  = f_ma(ma_len6)

// Plotten und Cloud-Füllung
mashortline1 = plot(ema1 ? mashort1 : na, color=showLine ? (mashort1 >= mashort1[1] ? color.olive : color.maroon) : na, linewidth=1, offset=emacloudleading, title="Short EMA Cloud-1")
malongline1 = plot(ema1 ? malong1 : na, color=showLine ? (malong1 >= malong1[1] ? color.green : color.red) : na, linewidth=3, offset=emacloudleading, title="Long EMA Cloud-1")
fill(mashortline1, malongline1, color=color.new(mashort1 >= malong1 ? #036103 : #880e4f, 45), title="EMA Cloud 1")

mashortline2 = plot(ema2 ? mashort2 : na, color=showLine ? (mashort2 >= mashort2[1] ? color.olive : color.maroon) : na, linewidth=1, offset=emacloudleading, title="Short EMA Cloud-2")
malongline2 = plot(ema2 ? malong2 : na, color=showLine ? (malong2 >= malong2[1] ? color.green : color.red) : na, linewidth=3, offset=emacloudleading, title="Long EMA Cloud-2")
fill(mashortline2, malongline2, color=color.new(mashort2 >= malong2 ? #4caf50 : #f44336, 65), title="EMA Cloud 2")

// Weitere Clouds können analog ergänzt werden...

// Crossover-Erkennung (Beispiel für Cloud 1)
bullishCrossover = crossover(mashort1, malong1)
bearishCrossunder = crossunder(mashort1, malong1)

// Alerts (optional)
if (bullishCrossover)
    alert("Bullisches EMA Cloud Crossover auf aktueller Zeitbasis!", alert.freq_once_per_bar_close)
if (bearishCrossunder)
    alert("Bärisches EMA Cloud Crossunder auf aktueller Zeitbasis!", alert.freq_once_per_bar_close)
