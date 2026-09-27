import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Booking details" };

export default function AdminBookingDetailsPage() {
  return (
    <AdminSection
      description="A verified, authorized booking record will be shown here without exposing customer data publicly."
      title="Booking details"
    />
  );
}
