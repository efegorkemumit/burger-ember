import { SectionKicker } from "@/components/ui/SectionKicker";

export function FirePatty() {
  return (
    <section data-phase="fire" className="relative z-20 h-[180vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between bg-gradient-to-b from-transparent via-iron/40 to-iron px-6 py-14 sm:px-10 lg:px-16">
        <SectionKicker index="03" label="FIRE / PATTY" />

        <div className="pointer-events-none flex flex-1 flex-col items-center justify-end pb-16 text-center">
          <p className="mb-3 font-mono text-xs tracking-[0.35em] text-ember">
            LIVE FIRE, NOT A FLAT-TOP
          </p>
          <h2 className="text-4xl leading-tight font-medium tracking-tight sm:text-6xl">
            Char. Smoke. Ember.
          </h2>
        </div>
      </div>
    </section>
  );
}
