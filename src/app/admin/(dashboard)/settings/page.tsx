import { saveStudioSettings } from "@/app/admin/management-actions";
import { ActionNotice } from "@/components/admin/action-notice";
import { getAdminStudioSettings } from "@/lib/admin-settings";
export const metadata = { title: "Studio settings" };
const field = "mt-1 w-full border border-line bg-surface px-3 py-2";
export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string }> }) {
  const [params, result] = await Promise.all([searchParams, getAdminStudioSettings()]);
  return <div className="max-w-3xl"><p className="eyebrow">Public information</p><h1 className="mt-3 font-display text-4xl">Studio settings</h1><p className="mt-3 text-muted">These details appear on the website. Add only approved studio information.</p><div className="mt-8"><ActionNotice error={params.error} notice={params.notice} /></div>
    {result.error ? <p role="alert">Studio settings could not be loaded.</p> : <form action={saveStudioSettings} className="mt-8 grid gap-5 border border-line bg-surface p-5 sm:grid-cols-2"><label className="sm:col-span-2">Studio name<input className={field} defaultValue={result.data?.studio_name ?? "Snapora Photography Studio"} maxLength={160} name="studio_name" required /></label><label>Phone<input className={field} defaultValue={result.data?.phone ?? ""} name="phone" type="tel" /></label><label>Email<input className={field} defaultValue={result.data?.email ?? ""} name="email" type="email" /></label><label className="sm:col-span-2">Address<textarea className={field} defaultValue={result.data?.address ?? ""} name="address" rows={2} /></label><label className="sm:col-span-2">Opening hours<textarea className={field} defaultValue={result.data?.hours ?? ""} name="hours" rows={2} /></label><label className="sm:col-span-2">Introduction<textarea className={field} defaultValue={result.data?.description ?? ""} name="description" rows={4} /></label><button className="rounded-full bg-ink px-5 py-3 text-sm text-cream sm:col-span-2 sm:justify-self-start">Save information</button></form>}
  </div>;
}
