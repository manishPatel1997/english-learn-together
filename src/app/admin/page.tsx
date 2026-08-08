"use client";

import React from "react";
import { AdminView } from "@/components/views/admin-view";
import { useAuth } from "@/context/auth-context";
import { ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-md">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-foreground">Access Denied (Admin Only)</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            You must be logged in as a System Administrator to access user permissions and module unlocking controls.
          </p>
        </div>
      </div>
    );
  }

  return <AdminView />;
}
