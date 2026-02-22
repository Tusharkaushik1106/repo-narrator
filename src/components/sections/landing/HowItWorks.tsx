import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { STEPS } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › HowItWorks
//
// Thin wrapper around FeatureGrid (step variant — detected via item.step).
// id="how-it-works" anchors the "How it works" nav link.
// Data imported from @/data/landing.
// ─────────────────────────────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <FeatureGrid
      environment="dark"
      spacing="lg"
      id="how-it-works"
      eyebrow="How it works"
      headline="Three steps, zero friction"
      subheadline="No local setup. No config. Paste a URL and you're in."
      items={STEPS}
      columns={3}
    />
  );
}
