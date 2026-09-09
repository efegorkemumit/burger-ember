export function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-plaster/50">
      <span className="text-ember">{index}</span>
      <span className="h-px w-8 bg-plaster/25" />
      <span>{label}</span>
    </div>
  );
}
