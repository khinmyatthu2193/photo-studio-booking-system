import "server-only";

export const BOOKING_CONFIRMATION_COOKIE = "snapora_booking_confirmation";

export type BookingConfirmation = {
  addons: { name: string; price: number }[];
  bookingDate: string;
  bookingNumber: string;
  packageName: string;
  status: "pending";
  timeSlot: string;
  totalPrice: number;
};

export function encodeBookingConfirmation(value: BookingConfirmation): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

export function decodeBookingConfirmation(value?: string): BookingConfirmation | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const item = parsed as Record<string, unknown>;
    if (
      typeof item.bookingNumber !== "string" ||
      typeof item.packageName !== "string" ||
      typeof item.bookingDate !== "string" ||
      typeof item.timeSlot !== "string" ||
      typeof item.totalPrice !== "number" ||
      item.status !== "pending" ||
      !Array.isArray(item.addons)
    ) {
      return null;
    }

    const addons = item.addons.filter(
      (addon): addon is { name: string; price: number } =>
        Boolean(
          addon &&
            typeof addon === "object" &&
            !Array.isArray(addon) &&
            typeof (addon as Record<string, unknown>).name === "string" &&
            typeof (addon as Record<string, unknown>).price === "number",
        ),
    );
    if (addons.length !== item.addons.length) return null;

    return {
      addons,
      bookingDate: item.bookingDate,
      bookingNumber: item.bookingNumber,
      packageName: item.packageName,
      status: "pending",
      timeSlot: item.timeSlot,
      totalPrice: item.totalPrice,
    };
  } catch {
    return null;
  }
}
