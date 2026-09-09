import { SectionKicker } from "@/components/ui/SectionKicker";

export function Build() {
  return (
    <section data-phase="build" className="relative z-20 h-[170vh]">
      <div className="schematic-grid sticky top-0 flex h-screen flex-col justify-between px-6 py-14 sm:px-10 lg:px-16">
        <SectionKicker index="04" label="BUILD" />

        <div className="pointer-events-none flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-3 font-mono text-xs tracking-[0.35em] text-ember">
            MOVE UP AND DOWN
          </p>
          <h2 className="max-w-lg text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
            Control the spacing yourself.
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="font-mono text-[10px] tracking-[0.3em] text-plaster/60">
            MAGNETIC SPACING — POINTER CONTROLLED
          </div>
        </div>
      </div>
    </section>
  );
}
