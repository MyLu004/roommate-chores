// fetch roomates/ household data
// hooks/useHousehold.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export type Roommate = {
  id: string;
  name: string;
  color?: string | null;
};

type UseHouseholdResult = {
  roommates: Roommate[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addRoommate: (name: string, color?: string) => Promise<void>;
};

/**
 * Expected Supabase table: "roommates"
 *
 * Suggested columns:
 * - id: uuid (primary key)
 * - name: text
 * - color: text (optional, e.g. "emerald")
 * - created_at: timestamp
 * - household_id: uuid (optional, if you support multiple households)
 */
export function useHousehold(): UseHouseholdResult {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToRoommate = useCallback((row: any): Roommate => {
    return {
      id: row.id,
      name: row.name ?? "Unnamed",
      color: row.color ?? null,
    };
  }, []);

  const fetchRoommates = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("roommates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[useHousehold] fetchRoommates error:", error);
      setError(error.message);
      setRoommates([]);
      setLoading(false);
      return;
    }

    setRoommates((data ?? []).map(mapRowToRoommate));
    setLoading(false);
  }, [mapRowToRoommate]);

  useEffect(() => {
    fetchRoommates();
  }, [fetchRoommates]);

  const addRoommate = useCallback(
    async (name: string, color?: string) => {
      if (!name.trim()) return;
      setError(null);

      const { data, error } = await supabase
        .from("roommates")
        .insert({
          name,
          color: color || null,
        })
        .select("*")
        .single();

      if (error) {
        console.error("[useHousehold] addRoommate error:", error);
        setError(error.message);
        return;
      }

      if (data) {
        setRoommates((prev) => [...prev, mapRowToRoommate(data)]);
      }
    },
    [mapRowToRoommate]
  );

  return {
    roommates,
    loading,
    error,
    
    addRoommate,
    refresh: fetchRoommates,
  };
}
