import { requireRole } from "@/lib/core/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function VendorDashboardLayout({ children }) {
  await requireRole("vendor");

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full">
      <DashboardSidebar role="vendor" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
