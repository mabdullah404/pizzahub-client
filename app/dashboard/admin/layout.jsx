import { DashboardSidebar } from "@/components/DashboardSidebar";
import { RoleGuard } from "@/components/RoleGuard";

export default function AdminDashboardLayout({ children }) {
  return (
    <RoleGuard allowedRole="admin">
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        <DashboardSidebar role="admin" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</div>
      </div>
    </RoleGuard>
  );
}
