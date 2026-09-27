import Link from "next/link";
import { ActionNotice } from "@/components/admin/action-notice";
import { getAdminBookings, type BookingStatus } from "@/lib/admin-bookings";
import { formatBookingDate, formatBookingTime } from "@/lib/booking";
import { formatMmk } from "@/lib/format";

export const metadata = { title: "Bookings" };
const filters = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<{ status?: string; error?: string; notice?: string }> }) {
  const params = await searchParams;
  const status = filters.includes(params.status as typeof filters[number]) ? params.status as BookingStatus | "all" : "all";
  const result = await getAdminBookings(status);
  return <div><p className="eyebrow">Studio operations</p><h1 className="mt-3 font-display text-4xl">Bookings</h1><p className="mt-3 text-muted">Review requests and manage their status.</p><div className="mt-8"><ActionNotice error={params.error} notice={params.notice} /></div>
    <nav aria-label="Booking status" className="mt-8 flex flex-wrap gap-2">{filters.map((filter) => <Link className={`rounded-full border px-4 py-2 text-sm capitalize ${status === filter ? "border-purple bg-purple text-white" : "border-line"}`} href={`/admin/bookings?status=${filter}`} key={filter}>{filter}</Link>)}</nav>
    {result.error ? <p className="mt-8 border border-coral-deep p-5" role="alert">Bookings could not be loaded.</p> : result.data.length === 0 ? <p className="mt-8 border border-dashed border-line p-8">No bookings in this view.</p> : <div className="mt-8 overflow-x-auto border border-line bg-surface"><table className="w-full min-w-[48rem] text-left text-sm"><thead className="bg-peach/45"><tr>{["Booking", "Customer", "Package", "Session", "Total", "Status"].map((label) => <th className="p-4" key={label}>{label}</th>)}</tr></thead><tbody className="divide-y divide-line">{result.data.map((item) => <tr key={item.id}><td className="p-4"><Link className="font-semibold text-purple hover:underline" href={`/admin/bookings/${item.id}`}>{item.booking_number}</Link></td><td className="p-4">{item.customer_name}<span className="block text-muted">{item.phone}</span></td><td className="p-4">{item.package_name}</td><td className="p-4">{formatBookingDate(item.booking_date)}<span className="block text-muted">{formatBookingTime(item.time_slot)}</span></td><td className="p-4">{formatMmk(item.total_price)}</td><td className="p-4 capitalize">{item.status}</td></tr>)}</tbody></table></div>}
  </div>;
}
