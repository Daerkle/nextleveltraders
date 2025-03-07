export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          stripe_customer_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          stripe_customer_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          stripe_customer_id?: string
          user_id?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          current_period_end: string
          status: "active" | "canceled" | "past_due" | "trialing"
          stripe_subscription_id: string
          user_id: string
          price_id: string
          trial_end: string | null
          trial_start: string | null
          cancel_at: string | null
          canceled_at: string | null
          ended_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          current_period_end: string
          status: "active" | "canceled" | "past_due" | "trialing"
          stripe_subscription_id: string
          user_id: string
          price_id: string
          trial_end?: string | null
          trial_start?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          ended_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          current_period_end?: string
          status?: "active" | "canceled" | "past_due" | "trialing"
          stripe_subscription_id?: string
          user_id?: string
          price_id?: string
          trial_end?: string | null
          trial_start?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          ended_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}