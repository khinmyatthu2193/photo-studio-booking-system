import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Bookings" };

export default function AdminBookingsPage() {
  return (
    <AdminSection
      description="Booking requests and their statuses will be managed here after the secure booking foundation exists."
      title="Bookings"
    />
  );
}
