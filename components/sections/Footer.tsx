import { SectionKicker } from "@/components/ui/SectionKicker";

const PLACEHOLDER_MENU = [
  "Ember Classic — placeholder",
  "Double Ember — placeholder",
  "Smoke & Cheddar — placeholder",
  "Charred Veg — placeholder",
];

export function Footer() {
  return (
    <footer
      id="menu"
      data-phase="footer"
      className="relative z-20 border-t border-plaster/15 bg-iron px-6 py-16 sm:px-10 lg:px-16"
    >
      <SectionKicker index="07" label="FOOTER" />

      <div className="mt-10 grid grid-cols-1 gap-10 font-mono text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 text-xs tracking-[0.3em] text-plaster/60">
            FULL MENU — PLACEHOLDER
          </div>
          <ul className="space-y-1 text-plaster/60">
            {PLACEHOLDER_MENU.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-plaster/60">
            Real menu &amp; pricing coming soon.
          </p>
        </div>

        <div>
          <div className="mb-3 text-xs tracking-[0.3em] text-plaster/60">
            LOCATION
          </div>
          <p className="text-plaster/60">Address placeholder</p>
          <p className="text-plaster/60">City, placeholder</p>
        </div>

        <div>
          <div className="mb-3 text-xs tracking-[0.3em] text-plaster/60">
            HOURS
          </div>
          <p className="text-plaster/60">Hours placeholder</p>
        </div>

        <div>
          <div className="mb-3 text-xs tracking-[0.3em] text-plaster/60">
            CONTACT / SOCIAL
          </div>
          <p className="text-plaster/60">Phone placeholder</p>
          <p className="text-plaster/60">@handle placeholder</p>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-plaster/10 pt-6 font-mono text-[11px] text-plaster/60 sm:flex-row">
        <span>© BURGER EMBER</span>
        <span>LIVE-FIRE ASADOR — GRAPHIC &amp; TECHNICAL</span>
      </div>
    </footer>
  );
}
