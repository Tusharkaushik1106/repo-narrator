import { GitFork } from "lucide-react";
import { CTASection } from "@/components/blocks/CTASection";
import { RepoAnalyzeForm } from "./RepoAnalyzeForm";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › FinalCTA
//
// Thin wrapper around CTASection.
// RepoAnalyzeForm passed as the form slot — behavioral logic unchanged.
// ─────────────────────────────────────────────────────────────────────────────

export function FinalCTA() {
  return (
    <CTASection
      environment="dark"
      spacing="lg"
      eyebrow="Ready when you are"
      eyebrowIcon={GitFork}
      headline={
        <>
          Your next repo is{" "}
          <span className="bg-gradient-to-r from-tomato-jam to-metallic-gold bg-clip-text text-transparent">
            one URL away
          </span>
        </>
      }
      subheadline="Drop any GitHub repository below. No setup, no configuration — just a URL and 60 seconds."
      form={<RepoAnalyzeForm />}
    />
  );
}
