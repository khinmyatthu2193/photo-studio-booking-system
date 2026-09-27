export type BookingInput = {
  addonIds: string[];
  bookingDate: string;
  customerName: string;
  email: string;
  packageId: string;
  peopleCount: string;
  phone: string;
  socialContact: string;
  specialRequest: string;
  timeSlot: string;
};

export type ValidBookingInput = Omit<BookingInput, "peopleCount"> & {
  peopleCount: number | null;
};

export type BookingValidationResult =
  | { data: ValidBookingInput; valid: true }
  | { errors: Record<string, string>; valid: false };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{5,32}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getStudioToday(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Yangon",
    year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function validateBookingInput(
  value: unknown,
  studioToday = getStudioToday(),
): BookingValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { errors: { form: "The booking details are invalid." }, valid: false };
  }

  const raw = value as Record<string, unknown>;
  const text = (key: string) => (typeof raw[key] === "string" ? raw[key].trim() : "");
  const rawAddonIds = raw.addonIds;
  const addonIds = Array.isArray(rawAddonIds)
    ? rawAddonIds.filter((item): item is string => typeof item === "string")
    : [];
  const data: BookingInput = {
    addonIds,
    bookingDate: text("bookingDate"),
    customerName: text("customerName"),
    email: text("email"),
    packageId: text("packageId"),
    peopleCount: text("peopleCount"),
    phone: text("phone"),
    socialContact: text("socialContact"),
    specialRequest: text("specialRequest"),
    timeSlot: text("timeSlot"),
  };
  const errors: Record<string, string> = {};

  if (data.customerName.length < 1 || data.customerName.length > 120) {
    errors.customerName = "Enter your full name.";
  }
  if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (data.email && (data.email.length > 254 || !EMAIL_PATTERN.test(data.email))) {
    errors.email = "Enter a valid email address.";
  }
  if (data.socialContact.length > 120) {
    errors.socialContact = "Keep the contact ID under 120 characters.";
  }
  if (!UUID_PATTERN.test(data.packageId)) {
    errors.packageId = "Choose a package.";
  }
  if (
    !DATE_PATTERN.test(data.bookingDate) ||
    !isCalendarDate(data.bookingDate) ||
    data.bookingDate < studioToday
  ) {
    errors.bookingDate = "Choose today or a future date.";
  }
  if (!TIME_PATTERN.test(data.timeSlot)) {
    errors.timeSlot = "Choose an available time.";
  }
  if (data.specialRequest.length > 2000) {
    errors.specialRequest = "Keep the request under 2,000 characters.";
  }

  const peopleCount = data.peopleCount === "" ? null : Number(data.peopleCount);
  if (
    (raw.peopleCount !== undefined && typeof raw.peopleCount !== "string") ||
    peopleCount !== null &&
    (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 100)
  ) {
    errors.peopleCount = "Enter a whole number from 1 to 100.";
  }

  if (
    (rawAddonIds !== undefined && !Array.isArray(rawAddonIds)) ||
    (Array.isArray(rawAddonIds) && rawAddonIds.some((id) => typeof id !== "string")) ||
    addonIds.some((id) => !UUID_PATTERN.test(id)) ||
    new Set(addonIds).size !== addonIds.length
  ) {
    errors.addonIds = "Choose valid add-ons without duplicates.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, valid: false };
  }

  return {
    data: { ...data, peopleCount },
    valid: true,
  };
}

function isCalendarDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function calculateBookingTotal(
  packagePrice: number,
  addonPrices: number[],
): number {
  return addonPrices.reduce((total, price) => total + price, packagePrice);
}

export function isBookingConflict(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "23P01" ||
    error.message?.toLowerCase().includes("overlaps an existing booking") === true
  );
}

export function formatBookingDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "Asia/Yangon",
  }).format(new Date(`${date}T00:00:00+06:30`));
}

export function formatBookingTime(time: string): string {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date(Date.UTC(2020, 0, 1, Number(hours), Number(minutes)));

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
