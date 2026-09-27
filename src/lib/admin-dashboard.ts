import "server-only";

import { getStudioMonthBounds } from "@/lib/dashboard-dates";
import { createClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
  monthBookings: number;
  monthRevenue: number;
  pendingRequests: number;
  todayBookings: number;
  upcomingBookings: number;
};

export type DashboardMetricsResult =
  | { metrics: DashboardMetrics; status: "ready" }
  | { status: "error" };

export async function getDashboardMetrics(
  today: string,
): Promise<DashboardMetricsResult> {
  const supabase = await createClient();
  const { firstDay, nextMonth } = getStudioMonthBounds(today);
  const [todayResult, upcomingResult, pendingResult, monthResult, revenueResult] =
    await Promise.all([
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("booking_date", today)
        .in("status", ["pending", "confirmed", "completed"]),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gt("booking_date", today)
        .in("status", ["pending", "confirmed"]),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("booking_date", firstDay)
        .lt("booking_date", nextMonth)
        .neq("status", "cancelled"),
      supabase
        .from("bookings")
        .select("total_price")
        .gte("booking_date", firstDay)
        .lt("booking_date", nextMonth)
        .in("status", ["confirmed", "completed"]),
    ]);

  if (
    todayResult.error ||
    upcomingResult.error ||
    pendingResult.error ||
    monthResult.error ||
    revenueResult.error
  ) {
    return { status: "error" };
  }

  return {
    metrics: {
      monthBookings: monthResult.count ?? 0,
      monthRevenue: (revenueResult.data ?? []).reduce(
        (total, booking) => total + booking.total_price,
        0,
      ),
      pendingRequests: pendingResult.count ?? 0,
      todayBookings: todayResult.count ?? 0,
      upcomingBookings: upcomingResult.count ?? 0,
    },
    status: "ready",
  };
}
