"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/use-user-store";

export function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();

  useEffect(() => {
    // Check token in localStorage if not yet in store
    if (!isAuthenticated) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (requireAdmin && user && !user.is_admin) {
      router.replace("/dashboard");
    }
  }, [requireAdmin, user, router]);

  if (!isAuthenticated && !localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070c1a" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span className="text-xs text-text2">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
