import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { PERSONAS } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › SelfSelectionCards
//
// Thin wrapper around FeatureGrid (persona variant).
// Data imported from @/data/landing.
// ─────────────────────────────────────────────────────────────────────────────

export function SelfSelectionCards() {
  return (
    <FeatureGrid
      environment="dark"
      spacing="lg"
      eyebrow="Built for"
      headline="Which one are you?"
      items={PERSONAS}
      columns={3}
    />
  );
}
