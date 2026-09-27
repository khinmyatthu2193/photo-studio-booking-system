import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Calendar" };

export default function AdminCalendarPage() {
  return (
    <AdminSection
      description="The studio's month and day booking views will be connected here."
      title="Calendar"
    />
  );
}
