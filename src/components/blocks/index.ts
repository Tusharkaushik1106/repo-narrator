/**
 * Blocks — prop-driven layout components
 *
 * These are mid-level building blocks that separate layout structure from
 * content. Import the component you need and supply content via props.
 * All text, icons, and data must be passed in — no hardcoded copy.
 *
 * Usage:
 *   import { FeatureGrid, CTASection } from "@/components/blocks"
 *   import { PAIN_POINTS, STEPS }      from "@/data/landing"
 *
 *   <FeatureGrid
 *     eyebrow="Features"
 *     headline="What you get"
 *     items={PAIN_POINTS}
 *     environment="dark"
 *   />
 */

export { HeroSection }           from "./HeroSection";
export { FeatureGrid }           from "./FeatureGrid";
export { ProofSection }          from "./ProofSection";
export { TestimonialSection }    from "./TestimonialSection";
export { CTASection }            from "./CTASection";
export { SplitContentSection }   from "./SplitContentSection";

export type { HeroSectionProps }         from "./HeroSection";
export type { FeatureGridProps }         from "./FeatureGrid";
export type { ProofSectionProps }        from "./ProofSection";
export type { TestimonialSectionProps }  from "./TestimonialSection";
export type { CTASectionProps }          from "./CTASection";
export type { SplitContentSectionProps } from "./SplitContentSection";
