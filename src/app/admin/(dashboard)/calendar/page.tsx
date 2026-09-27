import Link from "next/link";
import { getCalendarBookings } from "@/lib/admin-calendar";
import { getStudioToday, formatBookingTime } from "@/lib/booking";
import { getStudioMonthBounds } from "@/lib/dashboard-dates";
export const metadata = { title: "Calendar" };
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string; day?: string }> }) {
  const params = await searchParams; const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(params.month ?? "") ? params.month! : getStudioToday().slice(0, 7);
  const { firstDay, nextMonth } = getStudioMonthBounds(`${month}-01`); const result = await getCalendarBookings(firstDay, nextMonth);
  const lastDay = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)), 0)).getUTCDate();
  const dates = Array.from({ length: lastDay }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`); const selected = dates.includes(params.day ?? "") ? params.day : null;
  const shift = (offset: number) => { const d = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5)) - 1 + offset, 1)); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`; };
  return <div><p className="eyebrow">Studio schedule</p><h1 className="mt-3 font-display text-4xl">Calendar</h1><div className="mt-8 flex flex-wrap items-center gap-4"><Link className="rounded-full border border-line px-4 py-2" href={`/admin/calendar?month=${shift(-1)}`}>Previous</Link><strong>{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${firstDay}T00:00:00Z`))}</strong><Link className="rounded-full border border-line px-4 py-2" href={`/admin/calendar?month=${shift(1)}`}>Next</Link>{selected && <Link className="text-sm text-purple underline" href={`/admin/calendar?month=${month}`}>Month view</Link>}</div>
    {result.error ? <p className="mt-8 border border-coral-deep p-5" role="alert">Calendar could not be loaded.</p> : <div className={`mt-8 grid gap-2 ${selected ? "max-w-md" : "sm:grid-cols-2 lg:grid-cols-7"}`}>{dates.filter((day) => !selected || day === selected).map((day) => <section className="min-h-28 border border-line bg-surface p-3" key={day}><Link className="font-semibold text-purple hover:underline" href={`/admin/calendar?month=${month}&day=${day}`}>{Number(day.slice(-2))}</Link><ul className="mt-3 space-y-2">{result.data.filter((item) => item.booking_date === day).map((item) => <li className="border-t border-line pt-2 text-xs" key={item.id}><Link className="font-semibold hover:underline" href={`/admin/bookings/${item.id}`}>{formatBookingTime(item.time_slot)} · {item.package_name}</Link><span className="block text-muted">{item.customer_name} · {item.status}</span></li>)}</ul></section>)}</div>}
  </div>;
}
