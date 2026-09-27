import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Manage portfolio" };

export default function AdminPortfolioPage() {
  return (
    <AdminSection
      description="Approved portfolio uploads and publishing controls will be backed by Supabase Storage here."
      title="Portfolio"
    />
  );
}
