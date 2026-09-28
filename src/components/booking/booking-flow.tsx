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
    <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:gap-12">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between sm:hidden">
          <p className="text-sm font-semibold">Step {step} of {steps.length}</p>
          <p className="text-xs text-muted">{steps[step - 1]}</p>
        </div>
        <div
          aria-hidden="true"
          className="mb-7 h-1 overflow-hidden rounded-full bg-line sm:hidden"
        >
          <div
            className="h-full rounded-full bg-purple transition-[width] duration-300"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
        <ol
          aria-label="Booking progress"
          className="hidden grid-cols-6 border-y border-line sm:grid"
        >
          {steps.map((label, index) => {
            const number = index + 1;
            const isCurrent = step === number;
            const isComplete = step > number;
            return (
              <li
                aria-current={isCurrent ? "step" : undefined}
                className="relative"
                key={label}
              >
                <button
                  className={`flex w-full items-center gap-2.5 px-2 py-4 text-left text-xs transition-colors lg:px-3 ${
                    isCurrent ? "text-ink" : isComplete ? "text-purple" : "text-muted/65"
                  } ${isComplete ? "hover:bg-peach/35" : ""}`}
                  disabled={!isComplete}
                  onClick={() => setStep(number)}
                  type="button"
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold ${
                      isCurrent
                        ? "border-purple bg-purple text-cream"
                        : isComplete
                          ? "border-purple bg-purple/10 text-purple"
                          : "border-line"
                    }`}
                  >
                    {isComplete ? "✓" : number}
                  </span>
                  <span className="hidden font-semibold xl:inline">{label}</span>
                </button>
                {isCurrent ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-purple" />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mb-6 flex items-center justify-between border border-line bg-surface px-4 py-3 lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {selectedPackage?.name ?? "Choose a package"}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {form.bookingDate ? formatBookingDate(form.bookingDate) : "Date not chosen"}
            </p>
          </div>
          <p className="ml-4 shrink-0 font-display text-xl">{formatMmk(total)}</p>
        </div>

        <div className="border border-line bg-surface p-5 shadow-[0_18px_50px_rgba(73,49,41,0.06)] sm:p-8 lg:p-10">
          {step === 1 ? (
            <BookingStep
              description="Select the session that best fits what you want to create."
              eyebrow="Begin with the essentials"
              title="Choose your package"
            >
              <div className="grid gap-3">
                {packages.map((item) => {
                  const selected = item.id === form.packageId;
                  const inclusions = [
                    item.included_photos > 0 ? `${item.included_photos} edited photos` : null,
                    item.included_outfits > 0
                      ? `${item.included_outfits} ${item.included_outfits === 1 ? "outfit" : "outfits"}`
                      : null,
                    item.included_locations > 0
                      ? `${item.included_locations} ${item.included_locations === 1 ? "location" : "locations"}`
                      : null,
                  ].filter((value): value is string => value !== null);
                  return (
                    <button
                      aria-pressed={selected}
                      className={`group relative grid min-h-40 gap-5 border p-5 text-left transition sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6 ${
                        selected
                          ? "border-purple bg-purple/8 shadow-[inset_4px_0_0_var(--purple)]"
                          : "border-line bg-cream/25 hover:border-purple hover:bg-cream/60"
                      }`}
                      key={item.id}
                      onClick={() => choosePackage(item.id)}
                      type="button"
                    >
                      <span>
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={`flex size-5 items-center justify-center rounded-full border ${
                              selected ? "border-purple bg-purple" : "border-line bg-surface"
                            }`}
                          >
                            {selected ? <span className="size-1.5 rounded-full bg-cream" /> : null}
                          </span>
                          <span className="font-display text-2xl sm:text-3xl">{item.name}</span>
                        </span>
                        {item.description ? (
                          <span className="mt-3 block max-w-xl text-sm leading-6 text-muted">
                            {item.description}
                          </span>
                        ) : null}
                        <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                          <span>{formatDuration(item.duration_minutes)}</span>
                          {inclusions.map((inclusion) => (
                            <span key={inclusion}>· {inclusion}</span>
                          ))}
                        </span>
                      </span>
                      <span className="flex items-end justify-between gap-4 border-t border-line pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
                        <span className="text-[0.65rem] font-bold tracking-[0.14em] text-purple uppercase">
                          Session from
                        </span>
                        <span className="block font-display text-2xl sm:mt-2">
                          {formatMmk(item.price)}
                        </span>
                      </span>
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
              className="min-h-12 rounded-full border border-line px-6 text-sm font-semibold transition hover:border-purple hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              type="button"
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                className="min-h-12 rounded-full bg-coral px-8 text-sm font-semibold text-ink transition hover:bg-coral-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
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

      <aside className="hidden overflow-hidden bg-ink text-cream lg:sticky lg:top-28 lg:block">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.68rem] font-bold tracking-[0.18em] text-coral uppercase">
              Your request
            </p>
            <span className="rounded-full border border-cream/20 px-2.5 py-1 text-[0.65rem] text-cream/70">
              Not confirmed
            </span>
          </div>
          <p className="mt-6 font-display text-3xl leading-tight">
            {selectedPackage?.name ?? "Choose a package"}
          </p>
          {selectedPackage ? (
            <p className="mt-2 text-xs text-cream/55">
              {formatDuration(selectedPackage.duration_minutes)} session
            </p>
          ) : null}
        </div>
        <dl className="space-y-4 border-y border-cream/15 px-6 py-5 text-sm">
          <SummaryRow label="Date" value={form.bookingDate ? formatBookingDate(form.bookingDate) : "Not chosen"} />
          <SummaryRow label="Time" value={form.timeSlot ? formatBookingTime(form.timeSlot) : "Not chosen"} />
          <SummaryRow label="Add-ons" value={String(selectedAddons.length)} />
        </dl>
        <div className="p-6">
          <span className="text-xs text-cream/60">Estimated total</span>
          <span className="mt-1 block font-display text-3xl">{formatMmk(total)}</span>
          <p className="mt-5 border-t border-cream/15 pt-5 text-xs leading-5 text-cream/55">
            Final pricing and availability are verified when you submit. No payment is collected
            online.
          </p>
        </div>
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
      <div className="mt-7 sm:mt-8">{children}</div>
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
      <dt className="text-cream/55">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
