import Link from "next/link";
import { notFound } from "next/navigation";
import { changeBookingStatus } from "@/app/admin/management-actions";
import { ActionNotice } from "@/components/admin/action-notice";
import { ConfirmActionButton } from "@/components/admin/confirm-action-button";
import { getAdminBooking } from "@/lib/admin-bookings";
import { formatBookingDate, formatBookingTime } from "@/lib/booking";
import { formatMmk } from "@/lib/format";

export const metadata = { title: "Booking details" };
export default async function BookingDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; notice?: string }> }) {
  const [{ id }, message] = await Promise.all([params, searchParams]); const booking = await getAdminBooking(id); if (!booking) notFound();
  const fields = [["Customer", booking.customer_name], ["Phone", booking.phone], ["Email", booking.email ?? "Not supplied"], ["Social/contact ID", booking.social_contact ?? "Not supplied"], ["People", booking.people_count?.toString() ?? "Not supplied"], ["Package", booking.package_name], ["Date", formatBookingDate(booking.booking_date)], ["Time", formatBookingTime(booking.time_slot)], ["Duration", `${booking.duration_minutes} min`], ["Package price", formatMmk(booking.package_price)]];
  return <div className="max-w-4xl"><Link className="text-sm text-purple hover:underline" href="/admin/bookings">← All bookings</Link><p className="eyebrow mt-8">Booking request</p><h1 className="mt-3 font-display text-4xl">{booking.booking_number}</h1><p className="mt-3 capitalize text-muted">Status: {booking.status}</p><div className="mt-6"><ActionNotice error={message.error} notice={message.notice} /></div>
    <dl className="mt-8 grid gap-6 border-y border-line py-8 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-xs uppercase tracking-widest text-muted">{label}</dt><dd className="mt-2 break-words">{value}</dd></div>)}</dl>
    <h2 className="mt-8 font-display text-2xl">Add-ons</h2>{booking.addons.length ? <ul className="mt-4 divide-y divide-line">{booking.addons.map((item, i) => <li className="flex justify-between py-3" key={i}><span>{item.name}</span><span>{formatMmk(item.price)}</span></li>)}</ul> : <p className="mt-3 text-muted">No add-ons.</p>}
    <p className="mt-8 border-t border-line pt-5 text-xl font-semibold">Total: {formatMmk(booking.total_price)}</p><h2 className="mt-8 font-display text-2xl">Special request</h2><p className="mt-3 whitespace-pre-wrap text-muted">{booking.special_request || "None provided."}</p>
    <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-8">{booking.status === "pending" && <form action={changeBookingStatus.bind(null, id, "confirmed")}><button className="rounded-full bg-ink px-5 py-3 text-sm text-cream">Confirm booking</button></form>}{booking.status === "confirmed" && <form action={changeBookingStatus.bind(null, id, "completed")}><button className="rounded-full bg-ink px-5 py-3 text-sm text-cream">Mark completed</button></form>}{["pending", "confirmed"].includes(booking.status) && <form action={changeBookingStatus.bind(null, id, "cancelled")}><ConfirmActionButton label="Cancel booking" question="Cancel this booking?" /></form>}</div>
  </div>;
}
