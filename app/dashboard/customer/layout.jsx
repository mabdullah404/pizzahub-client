import { requireRole } from "@/lib/core/server";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function CustomerDashboardLayout({ children }) {
  await requireRole("customer");

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full">
      <DashboardSidebar role="customer" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
