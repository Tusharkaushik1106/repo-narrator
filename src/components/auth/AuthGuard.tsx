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
          <span className="gf-spinner gf-spinner-lg mx-auto" />
          <p className="mt-4 text-sm text-fg">Loading...</p>
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
