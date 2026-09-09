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
        <div />
      </div>
    </section>
  );
}
