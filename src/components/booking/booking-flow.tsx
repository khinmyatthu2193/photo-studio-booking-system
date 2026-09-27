"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  calculateBookingTotal,
  formatBookingDate,
  formatBookingTime,
  validateBookingInput,
  type BookingInput,
} from "@/lib/booking";
import { formatDuration, formatMmk } from "@/lib/format";
import type { PublicAddon, PublicPackage } from "@/lib/public-data";

type BookingFlowProps = {
  addons: PublicAddon[];
  initialPackageId?: string;
  packages: PublicPackage[];
  studioToday: string;
};

type Slot = { is_available: boolean; time_slot: string };
type AvailabilityStatus =
  | "idle"
  | "loading"
  | "available"
  | "blocked"
  | "closed"
  | "full"
  | "invalid"
  | "error";

const steps = ["Package", "Date", "Time", "Add-ons", "Your details", "Review"];

const inputClassName =
  "mt-2 min-h-12 w-full rounded-sm border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/15";

export function BookingFlow({
  addons,
  initialPackageId,
  packages,
  studioToday,
}: BookingFlowProps) {
  const router = useRouter();
  const validInitialPackage = packages.some((item) => item.id === initialPackageId)
    ? initialPackageId
    : "";
  const [step, setStep] = useState(validInitialPackage ? 2 : 1);
  const [form, setForm] = useState<BookingInput>({
    addonIds: [],
    bookingDate: "",
    customerName: "",
    email: "",
    packageId: validInitialPackage ?? "",
    peopleCount: "",
    phone: "",
    socialContact: "",
    specialRequest: "",
    timeSlot: "",
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPackage = packages.find((item) => item.id === form.packageId);
  const selectedAddons = addons.filter((item) => form.addonIds.includes(item.id));
  const total = calculateBookingTotal(
    selectedPackage?.price ?? 0,
    selectedAddons.map((item) => item.price),
  );

  const updateField = useCallback((field: keyof BookingInput, value: string | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError("");
  }, []);

  const loadAvailability = useCallback(async () => {
    if (!form.packageId || !form.bookingDate) {
      setAvailabilityStatus("idle");
      setSlots([]);
      return;
    }

    setAvailabilityStatus("loading");
    setSlots([]);
    try {
      const query = new URLSearchParams({
        date: form.bookingDate,
        packageId: form.packageId,
      });
      const response = await fetch(`/api/booking/availability?${query}`, {
        cache: "no-store",
      });
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error("Invalid availability response");
      }
      const value = result as { slots?: unknown; status?: unknown };
      const nextSlots = Array.isArray(value.slots)
        ? value.slots.filter(
            (slot): slot is Slot =>
              Boolean(
                slot &&
                  typeof slot === "object" &&
                  !Array.isArray(slot) &&
                  typeof (slot as Slot).time_slot === "string" &&
                  typeof (slot as Slot).is_available === "boolean",
              ),
          )
        : [];
      const nextStatus =
        typeof value.status === "string" ? (value.status as AvailabilityStatus) : "error";
      setSlots(nextSlots);
      setAvailabilityStatus(response.ok ? nextStatus : "error");
      setForm((current) =>
        nextSlots.some(
          (slot) => slot.time_slot === current.timeSlot && slot.is_available,
        )
          ? current
          : { ...current, timeSlot: "" },
      );
    } catch {
      setSlots([]);
      setAvailabilityStatus("error");
    }
  }, [form.bookingDate, form.packageId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadAvailability(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAvailability]);

  const availabilityMessage = useMemo(() => {
    switch (availabilityStatus) {
      case "loading":
        return "Checking studio availability…";
      case "blocked":
        return "The studio is unavailable on this date. Please choose another day.";
      case "closed":
        return "The studio is closed on this day. Please choose another date.";
      case "full":
        return "No time slots are available for this date. Please choose another date.";
      case "error":
        return "Availability could not be loaded. Please try again.";
      default:
        return "";
    }
  }, [availabilityStatus]);

  function choosePackage(packageId: string) {
    setForm((current) => ({
      ...current,
      bookingDate: "",
      packageId,
      timeSlot: "",
    }));
    setSlots([]);
    setAvailabilityStatus("idle");
    setFieldErrors({});
  }

  function toggleAddon(addonId: string) {
    updateField(
      "addonIds",
      form.addonIds.includes(addonId)
        ? form.addonIds.filter((id) => id !== addonId)
        : [...form.addonIds, addonId],
    );
  }

  function continueFlow() {
    if (step === 1 && !selectedPackage) {
      setFieldErrors({ packageId: "Choose one package to continue." });
      return;
    }
    if (step === 2) {
      if (!form.bookingDate || form.bookingDate < studioToday) {
        setFieldErrors({ bookingDate: "Choose today or a future date." });
        return;
      }
      if (availabilityStatus !== "available") {
        setFieldErrors({
          bookingDate: availabilityMessage || "Choose an available studio date.",
        });
        return;
      }
    }
    if (step === 3 && !form.timeSlot) {
      setFieldErrors({ timeSlot: "Choose an available time." });
      return;
    }
    if (step === 5) {
      const validation = validateBookingInput(form, studioToday);
      if (!validation.valid) {
        setFieldErrors(validation.errors);
        return;
      }
    }

    setFieldErrors({});
    setStep((current) => Math.min(current + 1, steps.length));
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  async function submitBooking() {
    const validation = validateBookingInput(form, studioToday);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setStep(5);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/booking/submit", {
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result: unknown = await response.json();
      const value =
        result && typeof result === "object" && !Array.isArray(result)
          ? (result as { message?: string; success?: boolean; type?: string })
          : {};

      if (response.ok && value.success) {
        router.push("/booking/success");
        return;
      }

      if (response.status === 409 || value.type === "conflict") {
        setSubmitError(
          value.message ?? "That time was just booked. Please choose another available time.",
        );
        setStep(3);
        await loadAvailability();
        return;
      }

      setSubmitError(
        value.message ?? "Something went wrong while submitting your booking. Please try again.",
      );
    } catch {
      setSubmitError("Something went wrong while submitting your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="min-w-0">
        <ol aria-label="Booking progress" className="no-scrollbar flex gap-2 overflow-x-auto pb-4">
          {steps.map((label, index) => {
            const number = index + 1;
            return (
              <li
                aria-current={step === number ? "step" : undefined}
                className={`flex min-w-max items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                  step === number
                    ? "border-purple bg-purple text-cream"
                    : step > number
                      ? "border-coral bg-coral/25 text-ink"
                      : "border-line text-muted"
                }`}
                key={label}
              >
                <span>{number}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-line pt-8 sm:mt-8 sm:pt-10">
          {step === 1 ? (
            <BookingStep eyebrow="Step 1 of 6" title="Choose your package">
              <div className="grid gap-4 sm:grid-cols-2">
                {packages.map((item) => {
                  const selected = item.id === form.packageId;
                  return (
                    <button
                      aria-pressed={selected}
                      className={`min-h-44 rounded-sm border p-5 text-left transition ${
                        selected
                          ? "border-purple bg-purple text-cream"
                          : "border-line bg-surface hover:border-purple"
                      }`}
                      key={item.id}
                      onClick={() => choosePackage(item.id)}
                      type="button"
                    >
                      <span className="font-display text-2xl">{item.name}</span>
                      <span className={`mt-2 block text-sm ${selected ? "text-cream/70" : "text-muted"}`}>
                        {formatDuration(item.duration_minutes)}
                      </span>
                      <span className="mt-8 block font-semibold">{formatMmk(item.price)}</span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={fieldErrors.packageId} />
            </BookingStep>
          ) : null}

          {step === 2 ? (
            <BookingStep eyebrow="Step 2 of 6" title="Choose your date">
              <label className="block max-w-md text-sm font-semibold">
                Photoshoot date
                <input
                  className={inputClassName}
                  min={studioToday}
                  onChange={(event) => {
                    updateField("bookingDate", event.target.value);
                    updateField("timeSlot", "");
                  }}
                  type="date"
                  value={form.bookingDate}
                />
              </label>
              {availabilityMessage ? (
                <p
                  aria-live="polite"
                  className={`mt-4 max-w-xl text-sm ${availabilityStatus === "loading" ? "text-muted" : "text-purple"}`}
                >
                  {availabilityMessage}
                </p>
              ) : form.bookingDate && availabilityStatus === "available" ? (
                <p className="mt-4 text-sm text-muted">This date has available session times.</p>
              ) : null}
              <FieldError message={fieldErrors.bookingDate} />
            </BookingStep>
          ) : null}

          {step === 3 ? (
            <BookingStep eyebrow="Step 3 of 6" title="Choose an available time">
              {submitError ? (
                <p
                  aria-live="assertive"
                  className="mb-5 border border-coral-deep bg-coral/20 p-4 text-sm text-ink"
                >
                  {submitError}
                </p>
              ) : null}
              {availabilityStatus === "loading" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div className="h-14 animate-pulse rounded-sm bg-peach" key={item} />
                  ))}
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {slots.map((slot) => {
                    const selected = slot.time_slot === form.timeSlot;
                    return (
                      <button
                        aria-pressed={selected}
                        className={`min-h-14 rounded-sm border px-4 py-3 font-semibold transition ${
                          !slot.is_available
                            ? "cursor-not-allowed border-line bg-peach/40 text-muted/55 line-through"
                            : selected
                              ? "border-purple bg-purple text-cream"
                              : "border-line bg-surface hover:border-purple"
                        }`}
                        disabled={!slot.is_available}
                        key={slot.time_slot}
                        onClick={() => updateField("timeSlot", slot.time_slot)}
                        type="button"
                      >
                        {formatBookingTime(slot.time_slot)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-line bg-peach/35 p-5 text-sm leading-6 text-muted">
                  {availabilityMessage || "No time slots are available. Please choose another date."}
                </div>
              )}
              <FieldError message={fieldErrors.timeSlot} />
              <button
                className="mt-6 text-sm font-semibold text-purple underline-offset-4 hover:underline"
                onClick={() => setStep(2)}
                type="button"
              >
                Choose another date
              </button>
            </BookingStep>
          ) : null}

          {step === 4 ? (
            <BookingStep
              description="Optional — continue without an add-on if your package already has everything you need."
              eyebrow="Step 4 of 6"
              title="Add finishing touches"
            >
              {addons.length > 0 ? (
                <div className="grid gap-3">
                  {addons.map((addon) => {
                    const selected = form.addonIds.includes(addon.id);
                    return (
                      <label
                        className={`flex cursor-pointer items-start gap-4 rounded-sm border p-4 transition ${
                          selected ? "border-purple bg-purple/8" : "border-line bg-surface"
                        }`}
                        key={addon.id}
                      >
                        <input
                          checked={selected}
                          className="mt-1 size-5 accent-purple"
                          onChange={() => toggleAddon(addon.id)}
                          type="checkbox"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap justify-between gap-2 font-semibold">
                            <span>{addon.name}</span>
                            <span>{formatMmk(addon.price)}</span>
                          </span>
                          {addon.description ? (
                            <span className="mt-1 block text-sm leading-6 text-muted">
                              {addon.description}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="border border-line bg-peach/35 p-5 text-sm text-muted">
                  No optional add-ons are currently available. You can continue with your package.
                </p>
              )}
            </BookingStep>
          ) : null}

          {step === 5 ? (
            <BookingStep eyebrow="Step 5 of 6" title="How can the studio reach you?">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={fieldErrors.customerName} required>
                  <input
                    autoComplete="name"
                    className={inputClassName}
                    maxLength={120}
                    onChange={(event) => updateField("customerName", event.target.value)}
                    value={form.customerName}
                  />
                </Field>
                <Field label="Phone" error={fieldErrors.phone} required>
                  <input
                    autoComplete="tel"
                    className={inputClassName}
                    inputMode="tel"
                    maxLength={32}
                    onChange={(event) => updateField("phone", event.target.value)}
                    value={form.phone}
                  />
                </Field>
                <Field label="Email" error={fieldErrors.email}>
                  <input
                    autoComplete="email"
                    className={inputClassName}
                    maxLength={254}
                    onChange={(event) => updateField("email", event.target.value)}
                    type="email"
                    value={form.email}
                  />
                </Field>
                <Field label="Social or contact ID" error={fieldErrors.socialContact}>
                  <input
                    className={inputClassName}
                    maxLength={120}
                    onChange={(event) => updateField("socialContact", event.target.value)}
                    value={form.socialContact}
                  />
                </Field>
                <Field label="Number of people" error={fieldErrors.peopleCount}>
                  <input
                    className={inputClassName}
                    inputMode="numeric"
                    max="100"
                    min="1"
                    onChange={(event) => updateField("peopleCount", event.target.value)}
                    type="number"
                    value={form.peopleCount}
                  />
                </Field>
                <Field
                  className="sm:col-span-2"
                  label="Special request"
                  error={fieldErrors.specialRequest}
                >
                  <textarea
                    className={`${inputClassName} min-h-32 resize-y`}
                    maxLength={2000}
                    onChange={(event) => updateField("specialRequest", event.target.value)}
                    placeholder="Share anything that will help the studio prepare."
                    value={form.specialRequest}
                  />
                </Field>
              </div>
            </BookingStep>
          ) : null}

          {step === 6 ? (
            <BookingStep eyebrow="Step 6 of 6" title="Review your request">
              <dl className="divide-y divide-line border-y border-line">
                <ReviewRow label="Package" value={selectedPackage?.name ?? "—"} />
                <ReviewRow
                  label="Date"
                  value={form.bookingDate ? formatBookingDate(form.bookingDate) : "—"}
                />
                <ReviewRow
                  label="Time"
                  value={form.timeSlot ? formatBookingTime(form.timeSlot) : "—"}
                />
                <ReviewRow
                  label="Add-ons"
                  value={
                    selectedAddons.length > 0
                      ? selectedAddons.map((item) => item.name).join(", ")
                      : "None"
                  }
                />
                <ReviewRow label="Total" value={formatMmk(total)} strong />
              </dl>
              <p className="mt-6 text-sm leading-6 text-muted">
                Submitting creates a pending booking request. The studio must contact you to confirm
                the session.
              </p>
              {submitError ? (
                <p
                  aria-live="assertive"
                  className="mt-5 border border-coral-deep bg-coral/20 p-4 text-sm text-ink"
                >
                  {submitError}
                </p>
              ) : null}
            </BookingStep>
          ) : null}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            <button
              className="min-h-12 rounded-full border border-line px-6 text-sm font-semibold hover:border-purple disabled:cursor-not-allowed disabled:opacity-40"
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              type="button"
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                className="min-h-12 rounded-full bg-coral px-7 text-sm font-semibold text-ink hover:bg-coral-deep"
                onClick={continueFlow}
                type="button"
              >
                Continue
              </button>
            ) : (
              <button
                className="min-h-12 rounded-full bg-ink px-7 text-sm font-semibold text-cream hover:bg-ink-soft disabled:cursor-wait disabled:opacity-60"
                disabled={isSubmitting}
                onClick={() => void submitBooking()}
                type="button"
              >
                {isSubmitting ? "Submitting request…" : "Confirm booking request"}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="border border-line bg-surface p-5 lg:sticky lg:top-28">
        <p className="eyebrow">Your booking</p>
        <p className="mt-4 font-display text-2xl">{selectedPackage?.name ?? "Choose a package"}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <SummaryRow label="Date" value={form.bookingDate ? formatBookingDate(form.bookingDate) : "Not chosen"} />
          <SummaryRow label="Time" value={form.timeSlot ? formatBookingTime(form.timeSlot) : "Not chosen"} />
          <SummaryRow label="Add-ons" value={String(selectedAddons.length)} />
        </dl>
        <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
          <span className="text-sm text-muted">Estimated total</span>
          <span className="font-display text-2xl">{formatMmk(total)}</span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          Final pricing and availability are verified when you submit.
        </p>
      </aside>
    </div>
  );
}

function BookingStep({
  children,
  description,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] sm:text-5xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl leading-7 text-muted">{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Field({
  children,
  className = "",
  error,
  label,
  required = false,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {label} {required ? <span className="text-purple">*</span> : null}
      {children}
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-2 block text-sm text-purple">{message}</span> : null;
}

function ReviewRow({ label, strong = false, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={strong ? "font-display text-2xl" : "font-semibold"}>{value}</dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
