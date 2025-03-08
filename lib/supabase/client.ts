import { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { CookieOptions } from '@supabase/ssr'

type SupabaseClient = ReturnType<typeof createServerClient<Database>>

export class DatabaseClient {
  private client: SupabaseClient

  constructor(request?: NextRequest) {
    const options = request ? {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // In einer API-Route können wir Cookies nicht direkt setzen
          // Dies wird vom aufrufenden Code gehandhabt
        },
        remove(name: string, options: CookieOptions) {
          // In einer API-Route können wir Cookies nicht direkt entfernen
          // Dies wird vom aufrufenden Code gehandhabt
        },
      },
    } : undefined

    this.client = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      options
    )
  }

  async getUser() {
    return await this.client.auth.getUser()
  }

  async getActiveSubscription(userId: string) {
    const { data, error } = await this.client
      .from('subscriptions')
      .select()
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1)
      .single()

    if (error) throw error
    return data
  }

  async getCustomer(userId: string) {
    const { data, error } = await this.client
      .from('customers')
      .select()
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (error) throw error
    return data
  }

  async createCustomer(userId: string, stripeCustomerId: string) {
    const { error } = await this.client
      .from('customers')
      .insert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
      })

    if (error) throw error
  }
}

export function createDatabaseClient(request?: NextRequest) {
  return new DatabaseClient(request)
}