import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const usePredictionHistory = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lead_predictions")
        .select("*")
        .order("predicted_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setPredictions(data || []);
      }
      setLoading(false);
    };

    fetchPredictions();
  }, []);

  return { predictions, loading, error };
};
