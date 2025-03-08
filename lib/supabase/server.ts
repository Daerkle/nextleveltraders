import { createServerClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export function createClient(request?: NextRequest) {
  // Erstelle einen neuen Supabase-Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Wenn keine Request vorhanden ist, erstelle einen einfachen Client
  if (!request) {
    return createServerClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });
  }

  // Mit Request erstelle einen Cookie-basierten Client
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        const response = NextResponse.next();
        response.cookies.set({
          name,
          value,
          ...options,
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      },
      remove(name, options) {
        const response = NextResponse.next();
        response.cookies.set({
          name,
          value: '',
          ...options,
          maxAge: 0,
        });
      },
    },
  });
}