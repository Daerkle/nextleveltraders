import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Erstelle einen Supabase-Client mit den Umgebungsvariablen
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        message: "Supabase-Konfiguration fehlt",
        success: false,
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Versuche, eine einfache Abfrage auszuführen
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);
    
    // Wenn wir einen 404-Fehler bekommen, ist die Verbindung erfolgreich, aber die Tabelle existiert nicht
    if (error && error.code === '42P01') {
      return NextResponse.json({ 
        message: "Verbindung zu Supabase erfolgreich, aber Tabelle existiert nicht",
        success: true,
        error: {
          code: error.code,
          message: error.message
        },
        supabaseInfo: {
          url: supabaseUrl
        }
      });
    }
    
    if (error) {
      return NextResponse.json({ 
        message: "Fehler bei der Verbindung zu Supabase",
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        },
        supabaseInfo: {
          url: supabaseUrl
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Verbindung zu Supabase erfolgreich",
      success: true,
      data,
      supabaseInfo: {
        url: supabaseUrl
      }
    });
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return NextResponse.json({ 
      message: "Unerwarteter Fehler bei der Verbindung zu Supabase",
      success: false,
      error
    }, { status: 500 });
  }
}
