import { createClient } from '@supabase/supabase-js';

// Typ-Definition für Supabase-Tabellen, die wir später erweitern können
export type Database = {
  public: {
    Tables: {
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      watchlist_items: {
        Row: {
          id: string;
          watchlist_id: string;
          symbol: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          watchlist_id: string;
          symbol: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          watchlist_id?: string;
          symbol?: string;
        };
      };
    };
  };
};

// Supabase-Client erstellen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Konfigurationsfehler:', {
    url: supabaseUrl ? 'vorhanden' : 'fehlt',
    anonKey: supabaseAnonKey ? 'vorhanden' : 'fehlt'
  });
  throw new Error(
    'Supabase Umgebungsvariablen fehlen. Bitte stelle sicher, dass NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local gesetzt sind.'
  );
}

// Erstelle einen Supabase Client ohne Auth (da wir Clerk für Auth verwenden)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'nextleveltraders'
    }
  }
});

// Exportiere eine Funktion, die den Supabase Client mit einem Clerk Session Token erstellt
export function createClientWithAuth(clerkToken?: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'nextleveltraders',
        ...(clerkToken ? { Authorization: `Bearer ${clerkToken}` } : {})
      }
    }
  });
}