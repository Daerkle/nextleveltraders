import { NextRequest, NextResponse } from "next/server";
import { getQuotes } from "@/lib/fmp";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols');

    if (!symbols) {
      return NextResponse.json(
        { error: "Keine Symbole angegeben" },
        { status: 400 }
      );
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    
    // Validiere die Symbole
    if (symbolArray.some(s => !s)) {
      return NextResponse.json(
        { error: "Ungültiges Symbol gefunden" },
        { status: 400 }
      );
    }

    const quotes = await getQuotes(symbolArray);

    if (!quotes.length) {
      return NextResponse.json(
        { error: "Keine Daten für die angegebenen Symbole gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(quotes);
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    
    const errorMessage = error?.message || "Fehler beim Laden der Marktdaten";
    const statusCode = error?.status || 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}