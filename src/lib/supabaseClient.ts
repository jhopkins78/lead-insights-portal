
import { createClient } from "@supabase/supabase-js";

// Default values for development - replace these with your actual Supabase project values
const FALLBACK_URL = "https://example.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Try to get values from environment variables first
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Create a mock Supabase client if credentials are using fallbacks
const usingFallbacks = supabaseUrl === FALLBACK_URL || supabaseKey === FALLBACK_KEY;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Log appropriate message based on credential status
if (usingFallbacks) {
  console.warn(
    "Using fallback Supabase credentials. Most operations will fail. " +
    "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
} else {
  console.info("Supabase client initialized successfully");
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => !usingFallbacks;
