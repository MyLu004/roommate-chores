// fetch/ add/ update chores (using supabase)
// hooks/useChores.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { playCompleteSound, playAllDoneSound } from "../lib/sounds";
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
  updateChore: (id: string, input: Partial<NewChoreInput>) => Promise<void>;
  deleteChore: (id: string) => Promise<boolean>;
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
      else {
        // Play a sound when a chore is completed. If this toggle results
        // in *all* chores being completed, play the 'all done' sound.
        try {
          if (nextIsDone) {
            const willAllBeDone = chores.every((c) => (c.id === id ? nextIsDone : c.isDone));
            // fire-and-forget
            if (willAllBeDone) playAllDoneSound();
            else playCompleteSound();
          }
        } catch (e) {
          console.warn('[useChores] sound play error', e);
        }
      }
      // Keep the optimistic update in place; don't refresh the entire list
      // to avoid reverting the toggle due to timing issues
    },
    [chores, fetchChores]
  );

  const updateChore = useCallback(
    async (id: string, input: Partial<NewChoreInput>) => {
      setError(null);

      const prev = chores.find((c) => c.id === id);
      if (!prev) return;

      // Optimistic update
      setChores((prevList) =>
        prevList.map((c) => (c.id === id ? { ...c, ...input } : c))
      );

      const updatePayload: any = {};
      if (input.title !== undefined) updatePayload.title = input.title;
      if (input.assigneeName !== undefined)
        updatePayload.assignee_name = input.assigneeName;
      if (input.assigneeId !== undefined)
        updatePayload.assignee_id = input.assigneeId;
      if (input.dueLabel !== undefined) updatePayload.due_label = input.dueLabel;
      if (input.assigneeColor !== undefined)
        updatePayload.assignee_color = input.assigneeColor;

      const { error } = await supabase.from("chores").update(updatePayload).eq("id", id);

      if (error) {
        console.error("[useChores] updateChore error:", error);
        setError(error.message);
        // rollback
        setChores((prevList) => prevList.map((c) => (c.id === id ? prev : c)));
      }
    },
    [chores]
  );

  const deleteChore = useCallback(
    async (id: string) => {
      setError(null);
      if (!id) {
        setError("Invalid id");
        return false;
      }

      const prev = chores;

      // Optimistic remove
      setChores((prevList) => prevList.filter((c) => c.id !== id));

      // Include .select() so Supabase returns the deleted row or an explicit error
      const { data, error } = await supabase.from("chores").delete().eq("id", id).select();

      if (error) {
        console.error("[useChores] deleteChore error:", error);
        setError(error.message);
        // rollback
        setChores(prev);
        return false;
      }

      // Refresh the list to ensure consistent state (in case realtime misses)
      await fetchChores();
      return true;
    },
    [chores, fetchChores]
  );

  return {
    chores,
    loading,
    error,
    refresh: fetchChores,
    addChore,
    toggleChoreDone,
    updateChore,
    deleteChore,
  };
}
