import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Studio settings" };

export default function AdminSettingsPage() {
  return (
    <AdminSection
      description="Single-studio public information will be managed here after its data model is established."
      title="Studio settings"
    />
  );
}
