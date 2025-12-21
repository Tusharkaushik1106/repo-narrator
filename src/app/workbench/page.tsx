"use client";

import { DeepDiveExplorer } from "@/components/workbench/DeepDiveExplorer";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function WorkbenchPage() {
  return (
    <AuthGuard>
      <DeepDiveExplorer />
    </AuthGuard>
  );
}


