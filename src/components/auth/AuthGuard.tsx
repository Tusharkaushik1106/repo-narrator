"use client";

import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = pathname || "/";
      void signIn(undefined, { callbackUrl });
    }
  }, [status, pathname]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
          <p className="mt-4 text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
