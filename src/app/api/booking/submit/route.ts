import { NextResponse } from "next/server";

import {
  BOOKING_CONFIRMATION_COOKIE,
  encodeBookingConfirmation,
  type BookingConfirmation,
} from "@/lib/booking-confirmation";
import { getStudioToday, isBookingConflict, validateBookingInput } from "@/lib/booking";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

function parseAddons(value: Json): BookingConfirmation["addons"] | null {
  if (!Array.isArray(value)) return null;

  const addons: BookingConfirmation["addons"] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    if (typeof item.name !== "string" || typeof item.price !== "number") return null;
    addons.push({ name: item.name, price: item.price });
  }
  return addons;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { form: "The booking details are invalid." }, success: false },
      { status: 400 },
    );
  }

  const validation = validateBookingInput(body, getStudioToday());
  if (!validation.valid) {
    return NextResponse.json(
      { errors: validation.errors, success: false },
      { status: 400 },
    );
  }

  const input = validation.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_booking_request", {
      p_addon_ids: input.addonIds,
      p_booking_date: input.bookingDate,
      p_customer_name: input.customerName,
      p_email: input.email || undefined,
      p_package_id: input.packageId,
      p_people_count: input.peopleCount ?? undefined,
      p_phone: input.phone,
      p_social_contact: input.socialContact || undefined,
      p_special_request: input.specialRequest || undefined,
      p_time_slot: input.timeSlot,
    });

    if (error) {
      if (isBookingConflict(error)) {
        return NextResponse.json(
          {
            message: "That time was just booked. Please choose another available time.",
            success: false,
            type: "conflict",
          },
          { status: 409 },
        );
      }

      const invalidRequest = error.code === "22023";
      return NextResponse.json(
        {
          message: invalidRequest
            ? error.message
            : "Something went wrong while submitting your booking. Please try again.",
          success: false,
          type: invalidRequest ? "validation" : "error",
        },
        { status: invalidRequest ? 400 : 500 },
      );
    }

    const booking = data?.[0];
    const addons = booking ? parseAddons(booking.addons) : null;
    if (!booking || !addons || booking.status !== "pending") {
      return NextResponse.json(
        {
          message: "The booking was received, but its confirmation could not be displayed.",
          success: false,
          type: "error",
        },
        { status: 500 },
      );
    }

    const confirmation: BookingConfirmation = {
      addons,
      bookingDate: booking.booking_date,
      bookingNumber: booking.booking_number,
      packageName: booking.package_name,
      status: "pending",
      timeSlot: booking.time_slot,
      totalPrice: booking.total_price,
    };
    const response = NextResponse.json({ success: true });
    response.cookies.set(
      BOOKING_CONFIRMATION_COOKIE,
      encodeBookingConfirmation(confirmation),
      {
        httpOnly: true,
        maxAge: 60 * 30,
        path: "/booking/success",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    );
    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Something went wrong while submitting your booking. Please try again.",
        success: false,
        type: "error",
      },
      { status: 500 },
    );
  }
}
