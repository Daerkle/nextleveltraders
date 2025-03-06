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
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);