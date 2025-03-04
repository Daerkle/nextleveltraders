# Feste Anweisung und Struktur für eine LLM-basierte Trading-Plattform

Dieses Dokument definiert den Rahmen für eine automatisierte Setup-Erkennung, -Bewertung und -Empfehlung. Die Plattform soll auf Basis von LLM-Technologien Setups in unterschiedlichen Zeitrahmen (Tag, Woche, Monat) erkennen und folgende Aspekte berücksichtigen:

- Standard-Pivot-Berechnungen (Täglich, Wöchentlich, Monatlich)
- DM-Pivot-Analyse (DM R1 und DM S1) in Multiframe-Betrachtung
- Jahres-Pivot R2: Berechnung und Messung der Zeit, bis dieses Niveau erreicht wird
- Integration von SPY/QQQ Trendindikatoren (z. B. mittels gleitender Durchschnitte und ADX)
- Automatisierte Berechnung von Erfolgswahrscheinlichkeiten, Stop-Wahrscheinlichkeiten, Risk-Reward Ratio (RR) und konkrete Handelsvorschläge

---

## 1. Standard-Pivot-Berechnungen

Berechne für jeden Zeitrahmen (Tag, Woche, Monat) die klassischen Pivot-Level als Basis zur Setup-Erkennung.

### 1.1 Tägliche Pivot-Punkte

- **Pivot (Tag):**  
  \[
  \text{Pivot}_{\text{T}} = \frac{\text{Hoch}_{\text{Vortag}} + \text{Tief}_{\text{Vortag}} + \text{Schluss}_{\text{Vortag}}}{3}
  \]
- **Unterstützung S1 (Tag):**  
  \[
  S1_{T} = (2 \times \text{Pivot}_{\text{T}}) - \text{Hoch}_{\text{Vortag}}
  \]
- **Widerstand R1 (Tag):**  
  \[
  R1_{T} = (2 \times \text{Pivot}_{\text{T}}) - \text{Tief}_{\text{Vortag}}
  \]

### 1.2 Wöchentliche und Monatliche Pivot-Punkte

Analog zum Tages-Pivot:
- **Pivot (Woche/Monat):**  
  \[
  \text{Pivot}_{X} = \frac{\text{Hoch}_{X} + \text{Tief}_{X} + \text{Schluss}_{X}}{3} \quad (X = \text{Woche, Monat})
  \]
- **S1 (Woche/Monat):**  
  \[
  S1_{X} = (2 \times \text{Pivot}_{X}) - \text{Hoch}_{X}
  \]
- **R1 (Woche/Monat):**  
  \[
  R1_{X} = (2 \times \text{Pivot}_{X}) - \text{Tief}_{X}
  \]

*Implementierungshinweis:*  
Speichere und tracke diese Level, um Berührungen oder Umkehrungen zu erkennen. Erstelle Metriken (z. B. Anzahl Berührungen, Reaktionen am Level), um die Robustheit einzuschätzen.

---

## 2. DM-Pivot-Analyse (DM R1 & DM S1)

Für dynamischere Pivot-Berechnungen, die die Tagesentwicklung widerspiegeln, führe folgende Schritte aus:

### 2.1 DM Pivot Berechnung

- **Bedingt nach Kursverlauf:**  
  - Falls Schluss < Eröffnung:  
    \[
    \text{DM Pivot} = \frac{\text{Hoch} + (2 \times \text{Tief}) + \text{Schluss}}{4}
    \]
  - Falls Schluss > Eröffnung:  
    \[
    \text{DM Pivot} = \frac{(2 \times \text{Hoch}) + \text{Tief} + \text{Schluss}}{4}
    \]

### 2.2 Ableitung von DM R1 und DM S1

- **DM R1:**  
  \[
  DM\ R1 = \text{DM Pivot} + (\text{Hoch} - \text{Tief})
  \]
- **DM S1:**  
  \[
  DM\ S1 = \text{DM Pivot} - (\text{Hoch} - \text{Tief})
  \]

### 2.3 Multiframe-Bedingung

- **Bullishes (Long) Setup:**  
  Der Kurs muss in mindestens 2 von 3 Zeitrahmen (Tag, Woche, Monat) über DM R1 liegen.
- **Bärisches (Short) Setup:**  
  Der Kurs muss in mindestens 2 von 3 Zeitrahmen unter DM S1 liegen.

*Implementierungshinweis:*  
Berechne die DM-Level in jedem Zeitrahmen separat und führe einen Abgleich durch. Markiere Setups, wenn die definierten Bedingungen erfüllt sind.

---

## 3. Jahres-Pivot R2 Analyse

Die Analyse langfristiger Widerstandsniveaus gibt Hinweise auf den übergeordneten Trend.

### 3.1 Berechnung des Jahrespivots

- **Jahrespivot:**  
  \[
  \text{Pivot}_{\text{Jahr}} = \frac{\text{Hoch}_{\text{Jahr}} + \text{Tief}_{\text{Jahr}} + \text{Schluss}_{\text{Jahr}}}{3}
  \]
- **Jahres R2:**  
  \[
  R2_{\text{Jahr}} = \text{Pivot}_{\text{Jahr}} + (\text{Hoch}_{\text{Jahr}} - \text{Tief}_{\text{Jahr}})
  \]

### 3.2 Zeitmessung bis R2

- **Messung:**  
  Erfasse den Zeitpunkt, an dem der Kurs R2 (innerhalb eines Toleranzbereichs, z. B. ±1 %) erreicht.
- **Interpretation:**  
  - **Schnelles Erreichen:** Signalisiert starke Trendumkehrkraft und hohe Erfolgswahrscheinlichkeit.
  - **Langsames Erreichen:** Deutet auf einen schwächeren Trend hin.

*Implementierungshinweis:*  
Verwende Zeitstempel und berechne die Differenz (z. B. in Minuten oder als Anteil des Handelstages).

---

## 4. SPY/QQQ Trend Richtung als Filter

Die übergeordneten Marktbedingungen beeinflussen die Setup-Güte.

### 4.1 Trendindikatoren

- **Gleitende Durchschnitte (MAs):**  
  - Beispiel: 50-Tage und 200-Tage  
    - **Bullisch:** Kurs liegt über beiden MAs  
    - **Bärisch:** Kurs liegt unter beiden MAs  
- **Average Directional Index (ADX):**  
  - ADX > 25: Starker Trend  
  - ADX < 20: Seitwärtsbewegung (Choppy)

### 4.2 Integration

- **Long Setups:** Bevorzugt, wenn SPY/QQQ klar bullisch sind.  
- **Short Setups:** Bevorzugt, wenn SPY/QQQ eindeutig bärisch sind.  
- **Kein klarer Trend:** Reduziere Positionsgrößen oder setze Filter zur Volatilitätsanpassung.

*Implementierungshinweis:*  
Ermittle den Trendstatus in Echtzeit und integriere diesen als zusätzlichen Filter für Setup-Bestätigungen.

---

## 5. Setup-Messung, Wahrscheinlichkeiten, RR und Empfehlungen

Die Plattform soll für jedes identifizierte Setup automatisiert folgende Kennzahlen berechnen:

### 5.1 Setup-Erkennung

- **Regelbasierte Erkennung:**  
  - Prüfe, ob der Kurs ein berechnetes Pivot- oder DM-Level berührt oder durchbricht.
  - Bestimme den Multiframe-Zustand (z. B. Long: > DM R1 in mindestens 2 Zeitrahmen).

### 5.2 Wahrscheinlichkeitsberechnung

- **Erfolgswahrscheinlichkeit \(P(\text{Erfolg})\):**
  \[
  P(\text{Erfolg}) = \frac{\text{Anzahl erfolgreicher Umkehrtests an dem Level}}{\text{Gesamtzahl der Tests}}
  \]
- **Stop-Wahrscheinlichkeit:**  
  Ähnlich: Anzahl der Fälle, in denen Stop-Loss ausgelöst wurde, geteilt durch Gesamtzahl der Setups.

### 5.3 Risk-Reward Ratio (RR)

Berechne:
\[
RR = \frac{\text{Zielpreis} - \text{Einstiegskurs}}{\text{Einstiegskurs} - \text{Stop-Loss}}
\]
*Empfehlung:* Setze Setups bevorzugt mit RR ≥ 1,5 ein.

### 5.4 Automatisierte Handelsempfehlungen

- **Long Setup Empfehlung:**  
  - Einstieg: Beim Breakout über DM R1, falls in Multiframe-Betrachtung bestätigt.
  - Stop-Loss: Knapp unter dem letzten DM R1 oder Pivot-Support.
  - Ziel: Preisniveau basierend auf vorherigen Pivot- und R2-Leveln (RR-Berechnung berücksichtigen).
- **Short Setup Empfehlung:**  
  - Einstieg: Beim Ausbruch unter DM S1, wenn mehrere Zeitrahmen dies bestätigen.
  - Stop-Loss: Knapp über dem letzten DM S1 oder Pivot-Resistance.
  - Ziel: Analog, sodass ein RR ≥ 1,5 erreicht wird.

*Implementierungshinweis:*  
Die Plattform soll automatisch Kennzahlen berechnen, vergangene Daten zur Wahrscheinlichkeitsbestimmung tracken und dynamisch Empfehlungen generieren.

---

## 6. Zusammenfassung der Implementierungsschritte

1. **Datenintegration:**  
   - Echtzeit- und historische Kursdaten für das Zielinstrument sowie SPY/QQQ abrufen.
2. **Berechnungsmodul:**  
   - Implementiere die Formeln für Standard-Pivots, DM-Pivots und Jahrespivots (inkl. R2).
   - Berechne Trendindikatoren (MAs, ADX) für SPY/QQQ.
3. **Setup-Erkennung:**  
   - Definiere Regeln für Preisberührungen und Umkehrungen an den berechneten Levels.
   - Führe einen Multiframe-Abgleich durch.
4. **Wahrscheinlichkeits- & RR-Berechnung:**  
   - Tracke vergangene Setup-Erfolge und Misserfolge.
   - Berechne Erfolgs- und Stop-Wahrscheinlichkeiten sowie das RR.
5. **Empfehlungsmodul:**  
   - Generiere automatische Handelsvorschläge basierend auf den ermittelten Kennzahlen.
6. **Dashboard & Alerts:**  
   - Visualisiere Setups, Levels, Trendstatus und Kennzahlen.
   - Sende Alerts, wenn vordefinierte Bedingungen erfüllt sind.

---

# Fazit

Dieses strukturierte Framework dient als feste Anweisung für eine LLM-basierte Trading-Plattform, die automatisiert Setups erkennt, bewertet und Handelsvorschläge generiert. Durch die Kombination von Standard-Pivot- und DM-Pivot-Analysen, Multiframe-Betrachtung, jahrespivot R2 Timing und SPY/QQQ Trendfiltern entsteht ein umfassendes Tool, das Wahrscheinlichkeiten, Risk-Reward Ratios und konkrete Empfehlungen in Echtzeit bereitstellt.

