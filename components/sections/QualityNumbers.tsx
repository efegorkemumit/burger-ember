import { SectionKicker } from "@/components/ui/SectionKicker";

/**
 * The big "180G / 100% BEEF / OPEN FIRE / 2X CHEESE" typography itself is
 * rendered by the root-mounted QualityTypographyOverlay (see
 * components/scene/QualityTypographyOverlay.tsx) so it can sandwich the
 * persistent 3D burger between a back and a front copy. This section only
 * owns the scroll real estate and the schematic kicker.
 */
export function QualityNumbers() {
  return (
    <section data-phase="quality" className="relative z-20 h-[200vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between px-6 py-14 sm:px-10 lg:px-16">
        <SectionKicker index="05" label="QUALITY / NUMBERS" />
        {/* The big stat typography itself is aria-hidden (it's a purely
            decorative "sandwich" around the 3D mesh, split into a back and
            front copy by QualityTypographyOverlay) — without this, a screen
            reader gets nothing for this section but its kicker. */}
        <h2 className="sr-only">180g, 100% beef, cooked over open fire, double cheese</h2>
        <div />
      </div>
    </section>
  );
}
