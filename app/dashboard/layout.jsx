import { Navbar } from "@/components/Navbar";

export default function DashboardRootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row">{children}</div>
    </div>
  );
}
