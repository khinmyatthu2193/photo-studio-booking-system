import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Manage packages" };

export default function AdminPackagesPage() {
  return (
    <AdminSection
      description="The authenticated package catalog workflow will be implemented here."
      title="Packages"
    />
  );
}
