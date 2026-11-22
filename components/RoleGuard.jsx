"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export function RoleGuard({ allowedRole, children }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session || !session.user) {
      router.replace(`/sign-in?redirectTo=/dashboard/${allowedRole}`);
      return;
    }

    const user = session.user;
    if (user.isBlocked || user.banned) {
      router.replace("/sign-in?error=blocked");
      return;
    }

    if (user.role !== allowedRole) {
      if (user.role === "admin") router.replace("/dashboard/admin");
      else if (user.role === "vendor") router.replace("/dashboard/vendor");
      else router.replace("/dashboard/customer");
    }
  }, [session, isPending, allowedRole, router]);

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
      </div>
    );
  }

  if (!session || !session.user || session.user.role !== allowedRole) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
      </div>
    );
  }

  return children;
}
