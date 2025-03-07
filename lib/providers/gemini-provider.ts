import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatProvider } from "../types/chat";

export class GeminiProvider implements ChatProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
    }
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash-001",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });
      console.info("Gemini API erfolgreich konfiguriert");
    } catch (error) {
      console.error('Fehler bei der Gemini-Konfiguration:', error);
      throw error;
    }
  }

  private async getFMPData(endpoint: string): Promise<any> {
    try {
      const baseUrl = 'https://financialmodelingprep.com/api/v3';
      const apiKey = process.env.NEXT_PUBLIC_FMP_API_KEY;
      const response = await fetch(`${baseUrl}${endpoint}&apikey=${apiKey}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching FMP data:', error);
      return null;
    }
  }

  getSystemPrompt(): string {
    return `Du bist NeXus, ein fortschrittlicher KI-Assistent für Trading und Finanzanalyse bei NextLevelTraders.

Du hast direkten Zugriff auf die Financial Modeling Prep (FMP) API für Echtzeit-Marktdaten:
- Basis-URL: https://financialmodelingprep.com/stable/
- API Key: 7429b5ed13d44707b05ea011b9461a92
- Features: Aktienkurse, Finanzkennzahlen, technische Indikatoren, Marktanalysen
- Datenformate: JSON Responses mit verschiedenen Filteroptionen
- Globale Abdeckung mit mehreren Marktdatenquellen

Wichtige Regeln:
1. Nutze IMMER aktuelle Marktdaten aus der FMP API für deine Analysen
2. Gib präzise, datenbasierte Antworten mit Quellenangaben
3. Erkläre komplexe Trading-Konzepte verständlich
4. Bleibe objektiv und vermeide spekulative Aussagen
5. Strukturiere deine Antworten klar mit Zwischenüberschriften

Key Endpunkte:
- Aktienkurse: /quote/SYMBOL
- Finanzkennzahlen: /ratios/SYMBOL
- Technische Indikatoren: /technical_indicator/SYMBOL
- Marktdaten: /market/SYMBOL

Format deine Antworten immer mit:
1. MARKTDATEN
   - Aktuelle Preise und Veränderungen
   - Wichtige Kennzahlen
   - Technische Indikatoren

2. ANALYSE
   - Technische Bewertung
   - Fundamentale Einschätzung
   - Marktsentiment

3. HANDLUNGSEMPFEHLUNG
   - Konkrete Entry/Exit Levels
   - Stop-Loss und Take-Profit
   - Risiko/Chance Verhältnis

4. DISCLAIMER
   "Diese Analyse basiert auf Echtzeit-Marktdaten der FMP API und dient nur zu Informationszwecken. Alle Trading-Entscheidungen erfolgen auf eigenes Risiko."`;
  }

  async sendMessage(message: string, context?: string): Promise<string> {
    try {
      // Extract potential stock symbols from the message
      const symbolMatch = message.match(/\b[A-Z]{1,5}\b/g);
      let marketData = '';
      
      if (symbolMatch) {
        for (const symbol of symbolMatch) {
          try {
            const quote = await this.getFMPData(`/quote/${symbol}`);
            if (quote && quote[0]) {
              marketData += `\nAktuelle Marktdaten für ${symbol}:\n`;
              marketData += `Preis: $${quote[0].price}\n`;
              marketData += `Änderung: ${quote[0].changesPercentage}%\n`;
              marketData += `Volumen: ${quote[0].volume}\n`;
            }
          } catch (fmpError) {
            console.error(`Fehler beim Abrufen der FMP-Daten für ${symbol}:`, fmpError);
            // Fahre mit anderen Symbolen fort, wenn eines fehlschlägt
          }
        }
      }

      const systemPrompt = this.getSystemPrompt();
      const prompt = `${systemPrompt}\n\nAktuelle Marktdaten:\n${marketData}\n\nContext: ${context || 'None'}\n\nUser: ${message}`;

      try {
        console.info('Sende Anfrage an Gemini');
        const result = await this.model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
        });

        if (!result.response) {
          throw new Error('Keine Antwort vom KI-Modell erhalten');
        }

        const response = await result.response;
        console.debug('Gemini Antwort erhalten:', response);
        return response.text();

      } catch (genError) {
        console.error('Fehler bei der KI-Generierung:', genError);
        
        // Spezifische Fehlermeldungen
        if (genError instanceof Error) {
          if (genError.message.includes('API key not valid')) {
            throw new Error('API-Schlüssel ungültig. Bitte überprüfen Sie Ihre Konfiguration.');
          } else if (genError.message.includes('model not found')) {
            throw new Error('Das angegebene KI-Modell wurde nicht gefunden. Bitte kontaktieren Sie den Support.');
          } else if (genError.message.includes('quota exceeded')) {
            throw new Error('API-Limit überschritten. Bitte versuchen Sie es später erneut.');
          }
        }
        
        throw new Error('Fehler bei der KI-Generierung. Bitte versuchen Sie es später erneut.');
      }
    } catch (error) {
      console.error('Fehler im GeminiProvider:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
  }
}
