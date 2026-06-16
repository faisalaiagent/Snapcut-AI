export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          plan: "free" | "pro" | "business";
          credits_used: number;
          credits_reset_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          image?: string | null;
          plan?: "free" | "pro" | "business";
          credits_used?: number;
          credits_reset_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          image?: string | null;
          plan?: "free" | "pro" | "business";
          credits_used?: number;
          credits_reset_at?: string;
          updated_at?: string;
        };
      };
      images: {
        Row: {
          id: string;
          user_id: string;
          original_url: string;
          processed_url: string | null;
          cloudinary_original_id: string | null;
          cloudinary_processed_id: string | null;
          tool_used: string;
          status: "pending" | "processing" | "completed" | "failed";
          metadata: Json;
          file_size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_url: string;
          processed_url?: string | null;
          cloudinary_original_id?: string | null;
          cloudinary_processed_id?: string | null;
          tool_used: string;
          status?: "pending" | "processing" | "completed" | "failed";
          metadata?: Json;
          file_size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_url?: string;
          processed_url?: string | null;
          cloudinary_original_id?: string | null;
          cloudinary_processed_id?: string | null;
          tool_used?: string;
          status?: "pending" | "processing" | "completed" | "failed";
          metadata?: Json;
          file_size_bytes?: number | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          status: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          status?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          tool: string | null;
          image_id: string | null;
          ip_address: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          tool?: string | null;
          image_id?: string | null;
          ip_address?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          tool?: string | null;
          image_id?: string | null;
          ip_address?: string | null;
          timestamp?: string;
        };
      };
    };
  };
}
