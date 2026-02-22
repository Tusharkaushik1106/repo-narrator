import { FeatureGrid } from "@/components/blocks/FeatureGrid";
import { PAIN_POINTS } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › ProblemStatement
//
// Thin wrapper around FeatureGrid. Data imported from @/data/landing.
// ─────────────────────────────────────────────────────────────────────────────

export function ProblemStatement() {
  return (
    <FeatureGrid
      environment="dark"
      spacing="lg"
      eyebrow="The real cost of unfamiliarity"
      headline="Know the feeling?"
      subheadline="Every engineer has been dropped into an unfamiliar codebase. The first week is expensive — and not just for you."
      items={PAIN_POINTS}
      columns={3}
      footnote="gitlore is the senior engineer who already read everything — available on demand."
    />
  );
}
