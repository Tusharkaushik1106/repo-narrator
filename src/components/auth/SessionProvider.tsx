"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ReactNode } from "react";

/*
 * ── Development auth bypass ───────────────────────────────────────────────
 *
 * When NEXT_PUBLIC_DEV_AUTH_BYPASS=true (and NOT production), this provider
 * passes a fake Session object directly to NextAuthSessionProvider so that
 * useSession() returns { status: "authenticated" } on the very first render —
 * no loading state, no OAuth flow required.
 *
 * refetchInterval={0} + refetchOnWindowFocus={false} prevent the provider
 * from overwriting the mock before the middleware intercept kicks in.
 *
 * In production (NODE_ENV=production) the flag is ignored and the real
 * NextAuthSessionProvider runs with no arguments, exactly as before.
 */
const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true" &&
  process.env.NODE_ENV !== "production";

const DEV_SESSION: Session = {
  user: {
    name: "Local Dev",
    email: "dev@local.test",
    image: null,
  },
  expires: "2099-01-01T00:00:00.000Z",
};

export function SessionProvider({ children }: { children: ReactNode }) {
  if (DEV_BYPASS) {
    return (
      <NextAuthSessionProvider
        session={DEV_SESSION}
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        {children}
      </NextAuthSessionProvider>
    );
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
