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
        success: false
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Prüfe, ob die Tabelle bereits existiert
    const { error: checkError } = await supabase
      .from('watchlists')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      return NextResponse.json({ 
        message: "Watchlists-Tabelle existiert bereits",
        success: true
      });
    }
    
    // Wenn die Tabelle nicht existiert, erstelle sie mit der REST API
    // Wir verwenden hier die Supabase API direkt
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/create_table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      },
      body: JSON.stringify({
        table_name: 'watchlists',
        definition: `
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          user_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Fehler beim Erstellen der Tabelle:", errorData);
      
      // Versuche es mit einer alternativen Methode - SQL API
      try {
        const sqlRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          },
          body: JSON.stringify({
            query: `
              CREATE TABLE IF NOT EXISTS public.watchlists (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                user_id UUID,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
              
              INSERT INTO public.watchlists (name) 
              VALUES ('Standard')
              ON CONFLICT (name) DO NOTHING;
            `
          })
        });
        
        if (!sqlRes.ok) {
          throw new Error(`SQL API Fehler: ${sqlRes.status}`);
        }
        
        return NextResponse.json({ 
          message: "Watchlists-Tabelle erfolgreich mit SQL API erstellt",
          success: true
        });
      } catch (sqlError) {
        console.error("SQL API Fehler:", sqlError);
        return NextResponse.json({ 
          message: "Konnte Watchlists-Tabelle nicht erstellen",
          error: sqlError,
          success: false
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      message: "Watchlists-Tabelle erfolgreich erstellt",
      success: true
    });
  } catch (error) {
    console.error("Fehler beim Erstellen der Watchlists-Tabelle:", error);
    return NextResponse.json({ 
      message: "Fehler beim Erstellen der Watchlists-Tabelle",
      error,
      success: false
    }, { status: 500 });
  }
}
