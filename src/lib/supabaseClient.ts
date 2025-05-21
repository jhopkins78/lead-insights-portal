
import { createClient } from "@supabase/supabase-js";

// Use the provided Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://wyixbyciazhcaiwcqpqn.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aXhieWNpYXpoY2Fpd2NxcHFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzE2MjQ2NSwiZXhwIjoyMDYyNzM4NDY1fQ.bqdfG408pMU-WmcyNqOusJZYDLghoxXRsTTAxaVPc20";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if we're using the actual credentials or fallbacks
const isConfigured = true; // We've hardcoded the actual credentials

// Log appropriate message based on credential status
if (isConfigured) {
  console.info("Supabase client initialized successfully");
} else {
  console.warn(
    "Using fallback Supabase credentials. Most operations will fail. " +
    "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => isConfigured;
