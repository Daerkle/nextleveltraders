import { NextResponse } from 'next/server';

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

/**
 * Holt Nachrichten für ein bestimmtes Symbol oder für allgemeine Marktnachrichten
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const limit = searchParams.get('limit') || '10';
  const tickers = searchParams.get('tickers') || '';

  if (!FMP_API_KEY) {
    return NextResponse.json(
      { error: 'API-Schlüssel ist nicht konfiguriert' },
      { status: 500 }
    );
  }

  // Definiere einen Typ für die Nachrichtenobjekte
  type NewsItem = {
    symbol: string;
    publishedDate: string;
    title: string;
    image: string;
    site: string;
    text: string;
    url: string;
  };

  try {
    let endpoint: string;
    
    // Wenn ein Symbol angegeben ist, hole die Nachrichten für dieses Symbol
    if (symbol) {
      endpoint = `${FMP_BASE_URL}/stock_news?tickers=${symbol}&limit=${limit}&apikey=${FMP_API_KEY}`;
    }
    // Wenn Tickers angegeben sind (mehrere Symbole, durch Komma getrennt)
    else if (tickers) {
      endpoint = `${FMP_BASE_URL}/stock_news?tickers=${tickers}&limit=${limit}&apikey=${FMP_API_KEY}`;
    }
    // Ansonsten hole allgemeine Marktnachrichten
    else {
      endpoint = `${FMP_BASE_URL}/stock_news?limit=${limit}&apikey=${FMP_API_KEY}`;
    }

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`FMP API-Anfrage fehlgeschlagen: ${response.status}`);
    }
    
    const data = await response.json() as NewsItem[];
    
    // Nachrichten nach Datum sortieren (neueste zuerst)
    const sortedNews = data.sort((a: NewsItem, b: NewsItem) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });
    
    return NextResponse.json({ data: sortedNews });
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Nachrichten' },
      { status: 500 }
    );
  }
}