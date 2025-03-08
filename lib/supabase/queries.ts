import { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'

type SupabaseClient = ReturnType<typeof createServerClient<Database>>

export const getActiveSubscription = async (client: SupabaseClient, userId: string) => {
  const { data, error } = await client
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export const getCustomer = async (client: SupabaseClient, userId: string) => {
  const { data, error } = await client
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export const createCustomer = async (
  client: SupabaseClient,
  userId: string,
  stripeCustomerId: string
) => {
  const { error } = await client
    .from('customers')
    .insert({
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
    })

  if (error) throw error
}