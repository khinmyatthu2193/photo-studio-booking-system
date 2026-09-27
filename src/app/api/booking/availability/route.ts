import { NextResponse } from "next/server";

import { getStudioToday } from "@/lib/booking";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageId = searchParams.get("packageId") ?? "";
  const bookingDate = searchParams.get("date") ?? "";

  if (
    !UUID_PATTERN.test(packageId) ||
    !DATE_PATTERN.test(bookingDate) ||
    bookingDate < getStudioToday()
  ) {
    return NextResponse.json(
      { message: "Choose a valid package and future date.", slots: [], status: "invalid" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const dayOfWeek = new Date(`${bookingDate}T12:00:00Z`).getUTCDay();
    const [blockedResult, hoursResult, slotsResult] = await Promise.all([
      supabase
        .from("blocked_dates")
        .select("id")
        .eq("blocked_date", bookingDate)
        .maybeSingle(),
      supabase
        .from("availability")
        .select("is_available,start_time,end_time")
        .eq("day_of_week", dayOfWeek)
        .maybeSingle(),
      supabase.rpc("get_booking_slots", {
        p_booking_date: bookingDate,
        p_package_id: packageId,
      }),
    ]);

    if (blockedResult.error || hoursResult.error || slotsResult.error) {
      return NextResponse.json(
        { message: "Availability could not be loaded.", slots: [], status: "error" },
        { status: 503 },
      );
    }

    if (blockedResult.data) {
      return NextResponse.json({ slots: [], status: "blocked" });
    }

    if (!hoursResult.data?.is_available) {
      return NextResponse.json({ slots: [], status: "closed" });
    }

    const slots = slotsResult.data ?? [];
    return NextResponse.json({
      slots,
      status: slots.some((slot) => slot.is_available) ? "available" : "full",
    });
  } catch {
    return NextResponse.json(
      { message: "Availability could not be loaded.", slots: [], status: "error" },
      { status: 503 },
    );
  }
}
