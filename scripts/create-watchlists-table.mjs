#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Lade Umgebungsvariablen aus .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL oder Key nicht gefunden in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createWatchlistsTable() {
  console.log('Erstelle watchlists Tabelle in Supabase...');

  // SQL für die Erstellung der watchlists Tabelle
  const { error } = await supabase.rpc('create_watchlists_table', {});

  if (error) {
    console.error('Fehler beim Erstellen der Tabelle:', error);
    
    // Versuche, die Tabelle direkt mit SQL zu erstellen
    console.log('Versuche alternative Methode...');
    
    const { error: sqlError } = await supabase.from('watchlists').select('*').limit(1);
    
    if (sqlError && sqlError.code === '42P01') { // Tabelle existiert nicht
      // Erstelle die Tabelle mit einem SQL-Statement
      const { error: createError } = await supabase.rpc('exec', { 
        sql: `
          CREATE TABLE IF NOT EXISTS public.watchlists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            user_id UUID,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Erstelle einen Standard-Eintrag
          INSERT INTO public.watchlists (name) 
          VALUES ('Standard')
          ON CONFLICT (name) DO NOTHING;
        `
      });
      
      if (createError) {
        console.error('Fehler beim direkten Erstellen der Tabelle:', createError);
        
        // Letzte Alternative: Versuche, die Tabelle über die REST API zu erstellen
        console.log('Versuche, die Tabelle über die REST API zu erstellen...');
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({
              command: `
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
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          console.log('Tabelle erfolgreich über REST API erstellt!');
        } catch (restError) {
          console.error('Fehler beim Erstellen der Tabelle über REST API:', restError);
          process.exit(1);
        }
      } else {
        console.log('Tabelle erfolgreich erstellt!');
      }
    } else if (sqlError) {
      console.error('Unerwarteter Fehler:', sqlError);
      process.exit(1);
    } else {
      console.log('Tabelle existiert bereits!');
    }
  } else {
    console.log('Tabelle erfolgreich erstellt!');
  }
}

// Führe die Funktion aus
createWatchlistsTable()
  .then(() => {
    console.log('Fertig!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unerwarteter Fehler:', error);
    process.exit(1);
  });
