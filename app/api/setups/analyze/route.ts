import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  generationConfig,
  safetySettings,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const {
      symbol,
      type,
      timeframe,
      entry,
      stopLoss,
      takeProfit,
      pivotLevels,
      emaStatus,
      marketStructure,
    } = await request.json();

    // Validierung der erforderlichen Felder
    if (!symbol || !type || !timeframe || !entry || !stopLoss || !takeProfit) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      );
    }

    // Erstelle eine detaillierte Setup-Beschreibung
    const setupDescription = `
    Symbol: ${symbol}
    Setup-Typ: ${type}
    Zeitrahmen: ${timeframe}
    Einstieg: ${entry}
    Stop-Loss: ${stopLoss}
    Take-Profit: ${takeProfit}
    
    Risk/Reward: ${((takeProfit - entry) / (entry - stopLoss)).toFixed(2)}
    
    Pivot-Level-Status:
    ${JSON.stringify(pivotLevels, null, 2)}
    
    EMA-Cloud-Status:
    ${JSON.stringify(emaStatus, null, 2)}
    
    Marktstruktur:
    ${marketStructure}
    `;

    const result = await model.generateContent(setupDescription);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({ 
      data: {
        symbol,
        type,
        timeframe,
        entry,
        stopLoss,
        takeProfit,
        riskReward: ((takeProfit - entry) / (entry - stopLoss)).toFixed(2),
        analysis,
      }
    });
  } catch (error) {
    console.error('Fehler bei der Setup-Analyse:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}