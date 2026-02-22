/**
 * Section environment wrappers
 *
 * Each wrapper sets data-section="dark|light|neutral" which triggers
 * the CSS variable overrides defined in globals.css. Every child component
 * (Button, Card, Input, Typography, etc.) automatically adapts its colours
 * to the section environment — no prop passing required.
 *
 * Usage:
 *   import { DarkSection, LightSection, NeutralSection } from "@/components/sections"
 *
 *   <DarkSection spacing="lg">
 *     <Heading>Hero title in almond-cream</Heading>
 *     <Button variant="primary">CTA button — always tomato-jam</Button>
 *     <Card>Glass card with dark surface gradient</Card>
 *   </DarkSection>
 *
 *   <LightSection>
 *     <Heading>Content heading in warm dark brown</Heading>
 *     <Card>Glass card with light surface gradient</Card>
 *   </LightSection>
 *
 *   <NeutralSection>
 *     <Form>All inputs, labels, errors adapt to neutral palette</Form>
 *   </NeutralSection>
 *
 * Available CSS variables within each section (for bespoke styles):
 *   --bg-primary      Main background color
 *   --bg-secondary    Elevated surface color
 *   --text-primary    Primary text color (= var(--fg))
 *   --text-secondary  Secondary / muted text color
 *   --accent          Interactive accent (always tomato-jam)
 *   --border          Default border color
 *   --card-bg         Card background color
 */

export { DarkSection }    from "./DarkSection";
export { LightSection }   from "./LightSection";
export { NeutralSection } from "./NeutralSection";

export type { DarkSectionProps }    from "./DarkSection";
export type { LightSectionProps }   from "./LightSection";
export type { NeutralSectionProps } from "./NeutralSection";
export type { SectionSpacing, SectionTag } from "./DarkSection";

// ── Landing page sections ───────────────────────────────────────────────────
export { RepoAnalyzeForm }      from "./landing/RepoAnalyzeForm";
export { HeroSection }          from "./landing/HeroSection";
export { LiveDemoStrip }        from "./landing/LiveDemoStrip";
export { CredibilityBar }       from "./landing/CredibilityBar";
export { ProblemStatement }     from "./landing/ProblemStatement";
export { SelfSelectionCards }   from "./landing/SelfSelectionCards";
export { FeatureWalkthrough }   from "./landing/FeatureWalkthrough";
export { HowItWorks }           from "./landing/HowItWorks";
export { ExtensionSpotlight }   from "./landing/ExtensionSpotlight";
export { FreeTierTransparency } from "./landing/FreeTierTransparency";
export { FinalCTA }             from "./landing/FinalCTA";
export { SiteFooter }           from "./landing/SiteFooter";
