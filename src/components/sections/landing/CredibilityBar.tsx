import { ProofSection } from "@/components/blocks/ProofSection";
import { INTEGRATIONS, STATS } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › CredibilityBar
//
// Thin wrapper around ProofSection.
// Data imported from @/data/landing.
// ─────────────────────────────────────────────────────────────────────────────

export function CredibilityBar() {
  return (
    <ProofSection
      environment="dark"
      spacing="sm"
      logosLabel="Integrates with"
      logos={INTEGRATIONS}
      stats={STATS}
    />
  );
}
