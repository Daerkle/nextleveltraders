import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { getMarketContext } from '@/lib/market-context';

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

// Chat History mit Kontext über Trading
const SYSTEM_PROMPT = `Du bist ein erfahrener Trading-Assistent, spezialisiert auf technische Analyse, 
Pivot-Punkte und Multi-Timeframe-Analyse. Deine Aufgabe ist es, Trader bei ihren Entscheidungen zu 
unterstützen und komplexe Marktkonzepte verständlich zu erklären.

Beachte dabei:
- Fokussiere dich auf technische Analyse und Marktstruktur
- Erkläre Trading-Konzepte klar und präzise
- Verwende konkrete Beispiele, wo hilfreich
- Gib keine spezifischen Anlageempfehlungen
- Erwähne Risikomanagement, wo angebracht

Antworte in einem professionellen, aber verständlichen Ton.`;

// POST: Chat-Nachricht senden und Antwort generieren
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

    const { message, symbol } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Nachricht ist erforderlich' },
        { status: 400 }
      );
    }

    // Marktkontext abrufen, falls ein Symbol angegeben wurde
    let marketContext = '';
    if (symbol) {
      const context = await getMarketContext(symbol);
      if (context) {
        marketContext = `
Aktuelle Marktdaten für ${symbol}:
- Aktueller Preis: $${context.currentPrice}
- Veränderung: ${context.priceChange > 0 ? '+' : ''}${context.priceChange}$ (${context.changePercent}%)
- Trend: ${context.trend}
- Volatilität (5-Tage): ${context.volatility}%
- Volumen: ${(context.volume / 1000000).toFixed(1)}M
`;
      }
    }

    // Antwort generieren mit Marktkontext
    const prompt = `${SYSTEM_PROMPT}${marketContext}

Benutzer: ${message}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Chat-Historie in der Datenbank speichern
    const chatHistory = await prisma.chatHistory.create({
      data: {
        userId,
        message,
        response: aiResponse,
      },
    });

    return NextResponse.json({ 
      data: {
        id: chatHistory.id,
        message: chatHistory.message,
        response: chatHistory.response,
        createdAt: chatHistory.createdAt,
      }
    });
  } catch (error) {
    console.error('Fehler in der Chat-Verarbeitung:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}

// GET: Chat-Historie abrufen
export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Chat-Historie aus der Datenbank abrufen
    const history = await prisma.chatHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Gesamtanzahl der Chat-Einträge
    const total = await prisma.chatHistory.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({ 
      data: history,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Chat-Historie:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}