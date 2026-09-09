import { SectionKicker } from "@/components/ui/SectionKicker";

export function FinalAssembly() {
  return (
    <section data-phase="assembly" className="relative z-20 h-[140vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between px-6 py-14 sm:px-10 lg:px-16">
        <SectionKicker index="06" label="FINAL ASSEMBLY" />

        <div className="pointer-events-none flex flex-1 flex-col items-center justify-center text-center">
          <h2 className="text-4xl leading-tight font-medium tracking-tight sm:text-6xl">
            Back together.
            <br />
            Ready to eat.
          </h2>
        </div>

        <div className="flex justify-center pb-4">
          <a
            href="#menu"
            className="pointer-events-auto inline-flex items-center gap-3 border border-ember bg-iron/85 px-8 py-4 font-mono text-sm tracking-[0.2em] text-plaster backdrop-blur-sm transition-[background-color,color,transform] duration-150 ease-out hover:bg-ember hover:text-iron active:scale-[0.97]"
          >
            VIEW THE FULL MENU
          </a>
        </div>
      </div>
    </section>
  );
}
