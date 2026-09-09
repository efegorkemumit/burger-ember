import { SectionKicker } from "@/components/ui/SectionKicker";

export function Hero() {
  return (
    <section
      data-phase="hero"
      className="schematic-grid relative z-20 flex h-screen min-h-[720px] flex-col justify-between px-6 pt-8 pb-14 sm:px-10 lg:px-16"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.35em] text-plaster/70">
          BURGER EMBER
        </span>
        <span className="hidden font-mono text-xs tracking-[0.3em] text-plaster/40 sm:block">
          LIVE-FIRE ASADOR
        </span>
      </div>

      <div className="pointer-events-none flex flex-1 flex-col items-center justify-start pt-6 text-center sm:pt-10">
        <p className="mb-3 font-mono text-xs tracking-[0.35em] text-ember">
          MOVE TO SEPARATE
        </p>
        <h1 className="text-5xl leading-[0.95] font-medium tracking-tight sm:text-7xl lg:text-8xl">
          BURGER
          <br />
          <span className="text-ember">EMBER</span>
        </h1>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xs text-center font-mono text-sm text-plaster/60 sm:text-left">
          Cooked over live fire, not a flat-top. Seven ingredients, one
          burger, built in front of you.
        </p>
        <SectionKicker index="01" label="HERO" />
      </div>
    </section>
  );
}
