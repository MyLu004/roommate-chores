// fetch/ add/ update chores (using supabase)
// hooks/useChores.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Chore as UiChore } from "../components/ChoreList";

export type Chore = UiChore;

type NewChoreInput = {
  title: string;
  assigneeName: string;
  assigneeId?: string | null; // UUID of the roommate
  dueLabel: string;
  assigneeColor?: string | null; // Optional color hex code
};

type UseChoresResult = {
  chores: Chore[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addChore: (input: NewChoreInput) => Promise<void>;
  toggleChoreDone: (id: string) => Promise<void>;
};

/**
 * Expected Supabase table: "chores"
 *
 * Columns (you can adjust, but this is the mapping used here):
 * - id: uuid (primary key)
 * - title: text
 * - assignee_name: text
 * - due_label: text
 * - is_done: boolean
 * - created_at: timestamp (for ordering)
 */
export function useChores(): UseChoresResult {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapRowToChore = useCallback((row: any): Chore => {
    return {
      id: row.id,
      title: row.title ?? "",
      assigneeName: row.assignee_name ?? "Unassigned",
      dueLabel: row.due_label ?? "",
      isDone: row.is_done ?? false,
      assigneeColor: row.assignee_color ?? null,
    };
  }, []);

  const fetchChores = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("chores")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[useChores] fetchChores error:", error);
      setError(error.message);
      setChores([]);
      setLoading(false);
      return;
    }

    setChores((data ?? []).map(mapRowToChore));
    setLoading(false);
  }, [mapRowToChore]);

  useEffect(() => {
    fetchChores();

    // Subscribe to realtime changes on the chores table
    const subscription = supabase
      .channel("public:chores")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events: INSERT, UPDATE, DELETE
          schema: "public",
          table: "chores",
        },
        (payload: any) => {
          console.log("[useChores] Realtime update received:", payload);
          // When any change happens, refresh the list
          fetchChores();
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchChores]);

  const addChore = useCallback(
    async (input: NewChoreInput) => {
      setError(null);

      const { data, error } = await supabase
        .from("chores")
        .insert({
          title: input.title,
          assignee_name: input.assigneeName,
          assignee_id: input.assigneeId || null,
          due_label: input.dueLabel,
          is_done: false,
          assignee_color: input.assigneeColor || null,
        })
        .select("*")
        .single();

      if (error) {
        console.error("[useChores] addChore error:", error);
        setError(error.message);
        return;
      }

      if (data) {
        // Small delay to ensure Supabase has fully processed the insert
        await new Promise(resolve => setTimeout(resolve, 300));
        // Refresh the list from Supabase after adding
        await fetchChores();
      }
    },
  [fetchChores]
  );

  const toggleChoreDone = useCallback(
    async (id: string) => {
      const current = chores.find((c) => c.id === id);
      if (!current) return;

      const nextIsDone = !current.isDone;

      // Optimistic update for snappy UI
      setChores((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                isDone: nextIsDone,
              }
            : c
        )
      );

      const { error } = await supabase
        .from("chores")
        .update({ is_done: nextIsDone })
        .eq("id", id);

      if (error) {
        console.error("[useChores] toggleChoreDone error:", error);
        setError(error.message);
        // Rollback optimistic update if needed
        setChores((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  isDone: current.isDone,
                }
              : c
          )
        );
      }
      // Keep the optimistic update in place; don't refresh the entire list
      // to avoid reverting the toggle due to timing issues
    },
    [chores]
  );

  return {
    chores,
    loading,
    error,
    refresh: fetchChores,
    addChore,
    toggleChoreDone,
  };
}
