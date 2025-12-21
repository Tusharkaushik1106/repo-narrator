"use client";

import { CockpitDashboard } from "@/components/dashboard/CockpitDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <CockpitDashboard />
    </AuthGuard>
  );
}


