import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Manage availability" };

export default function AdminAvailabilityPage() {
  return (
    <AdminSection
      description="Weekly hours and specific blocked dates will be managed here."
      title="Availability"
    />
  );
}
