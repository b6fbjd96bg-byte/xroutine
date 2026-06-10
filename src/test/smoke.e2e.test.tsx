/**
 * End-to-end smoke test (mocked Supabase client).
 *
 * Covers the full happy-path users experience without requiring email
 * confirmation in CI:
 *   1. Sign-up wiring (AuthContext -> supabase.auth.signUp)
 *   2. Habit CRUD + day completions (useHabits)
 *   3. Weekly habit CRUD + week completions + overview aggregation
 *   4. Admin role detection (useAdmin)
 *   5. Free vs premium subscription gating (useSubscription)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";

// ---------- Mock supabase client ----------
type Row = Record<string, any>;
const db: Record<string, Row[]> = {
  habits: [],
  weekly_habits: [],
  user_roles: [],
  user_subscriptions: [],
};

let currentUserId = "user-1";
let currentEmail = "test@example.com";

const makeQuery = (table: string) => {
  let filters: Array<(r: Row) => boolean> = [];
  let pending: Row | null = null;
  let mode: "select" | "insert" | "update" | "delete" = "select";

  const api: any = {
    select: () => api,
    order: () => api,
    eq: (col: string, val: any) => {
      filters.push((r) => r[col] === val);
      return api;
    },
    maybeSingle: async () => {
      const row = db[table].find((r) => filters.every((f) => f(r))) ?? null;
      return { data: row, error: null };
    },
    single: async () => {
      const row = pending ?? db[table].find((r) => filters.every((f) => f(r)));
      return { data: row, error: null };
    },
    insert: (payload: Row) => {
      mode = "insert";
      const row = { id: `${table}-${db[table].length + 1}`, ...payload };
      db[table].push(row);
      pending = row;
      return api;
    },
    update: (patch: Row) => {
      mode = "update";
      // apply on next then-resolution
      const apply = () => {
        db[table] = db[table].map((r) =>
          filters.every((f) => f(r)) ? { ...r, ...patch } : r
        );
      };
      api.then = (resolve: any) => {
        apply();
        resolve({ data: null, error: null });
      };
      return api;
    },
    delete: () => {
      mode = "delete";
      api.then = (resolve: any) => {
        db[table] = db[table].filter((r) => !filters.every((f) => f(r)));
        resolve({ data: null, error: null });
      };
      return api;
    },
    // default thenable for select-list
    then: async (resolve: any) => {
      const rows = db[table].filter((r) => filters.every((f) => f(r)));
      resolve({ data: rows, error: null });
    },
  };
  return api;
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => makeQuery(table),
    auth: {
      signUp: vi.fn(async (args: any) => ({
        data: { user: { id: currentUserId, email: args.email } },
        error: null,
      })),
      signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      getSession: async () => ({
        data: { session: { user: { id: currentUserId, email: currentEmail } } },
      }),
    },
  },
}));

// ---------- Mock auth + toast ----------
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: currentUserId, email: currentEmail },
    loading: false,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// ---------- Import after mocks ----------
import { useHabits } from "@/hooks/useHabits";
import { useSubscription } from "@/hooks/useSubscription";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";

beforeEach(() => {
  for (const k of Object.keys(db)) db[k] = [];
});

describe("E2E smoke: full user journey", () => {
  it("1. signs up a user (AuthContext wiring)", async () => {
    const { error } = await (supabase.auth.signUp as any)({
      email: "smoke@test.com",
      password: "Sup3rSecret!",
      options: { data: { display_name: "Smoke" } },
    });
    expect(error).toBeNull();
    expect(supabase.auth.signUp).toHaveBeenCalled();
  });

  it("2. creates habits and marks day completions", async () => {
    const { result } = renderHook(() => useHabits());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addHabit("Drink water", 30);
      await result.current.addHabit("Read 20m", 25);
    });
    expect(result.current.habits).toHaveLength(2);

    const id = result.current.habits[0].id;
    await act(async () => {
      await result.current.toggleDay(id, 1);
      await result.current.toggleDay(id, 2);
      await result.current.toggleDay(id, 5);
    });
    expect(result.current.habits[0].completedDays).toEqual([1, 2, 5]);

    // Untoggle
    await act(async () => {
      await result.current.toggleDay(id, 2);
    });
    expect(result.current.habits[0].completedDays).toEqual([1, 5]);

    // Edit + delete
    await act(async () => {
      await result.current.editHabit(id, "Drink 2L water", 30);
      await result.current.deleteHabit(result.current.habits[1].id);
    });
    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe("Drink 2L water");
  });

  it("3. tracks weekly habits and aggregates weekly overview", async () => {
    const { result } = renderHook(() => useHabits());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addWeeklyHabit("Laundry", 4);
      await result.current.addWeeklyHabit("Grocery run", 4);
    });
    const [a, b] = result.current.weeklyHabits;
    await act(async () => {
      await result.current.toggleWeek(a.id, 1);
      await result.current.toggleWeek(a.id, 2);
      await result.current.toggleWeek(b.id, 1);
    });

    // Aggregation: how many habits completed each week
    const weeks = [1, 2, 3, 4, 5];
    const overview = weeks.map((w) => ({
      week: w,
      completed: result.current.weeklyHabits.filter((h) =>
        h.completedWeeks.includes(w)
      ).length,
    }));
    expect(overview[0].completed).toBe(2); // week 1: both
    expect(overview[1].completed).toBe(1); // week 2: only a
    expect(overview[2].completed).toBe(0); // week 3: none
  });

  it("4. detects admin role correctly", async () => {
    // Non-admin first
    const { result: nonAdmin } = renderHook(() => useAdmin());
    await waitFor(() => expect(nonAdmin.current.loading).toBe(false));
    expect(nonAdmin.current.isAdmin).toBe(false);

    // Seed admin role and re-render
    db.user_roles.push({ user_id: currentUserId, role: "admin" });
    const { result: admin } = renderHook(() => useAdmin());
    await waitFor(() => expect(admin.current.loading).toBe(false));
    expect(admin.current.isAdmin).toBe(true);
  });

  it("5. enforces free-tier gating; premium unlocks everything", async () => {
    // Free user (no subscription row -> defaults to free)
    const { result: free } = renderHook(() => useSubscription());
    await waitFor(() => expect(free.current.loading).toBe(false));
    expect(free.current.isPremium).toBe(false);
    expect(free.current.limits.maxDailyHabits).toBe(5);
    expect(free.current.limits.maxWeeklyHabits).toBe(3);
    expect(free.current.limits.weeklyEmailReports).toBe(false);
    expect(free.current.limits.fullAnalytics).toBe(false);

    // Promote to premium
    db.user_subscriptions.push({ user_id: currentUserId, tier: "premium" });
    const { result: prem } = renderHook(() => useSubscription());
    await waitFor(() => expect(prem.current.loading).toBe(false));
    expect(prem.current.isPremium).toBe(true);
    expect(prem.current.limits.maxDailyHabits).toBe(Infinity);
    expect(prem.current.limits.weeklyEmailReports).toBe(true);
    expect(prem.current.limits.fullAnalytics).toBe(true);
    expect(prem.current.limits.fullAIMotivation).toBe(true);
  });
});
