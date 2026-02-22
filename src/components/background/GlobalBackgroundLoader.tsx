"use client";

import dynamic from "next/dynamic";

// Dynamic import lives here (client component) because `ssr: false` is not
// allowed in Server Components like layout.tsx.
const GlobalBackground = dynamic(
  () => import("@/components/background/GlobalBackground").then((m) => m.GlobalBackground),
  { ssr: false },
);

export function GlobalBackgroundLoader() {
  return <GlobalBackground />;
}
