import { Braces, CodeXml, Database, Hash, Network } from "lucide-react";
import type { Tech, BrandIcon as BrandIconType } from "../../config/site";

/** Renders an official Simple Icons brand path. */
export function BrandSvg({ icon, className, color = "currentColor" }: { icon: BrandIconType; className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}

const fallbacks = { csharp: Hash, sql: Database, vscode: CodeXml, api: Network } as const;

export function TechIcon({ tech, className }: { tech: Tech; className?: string }) {
  if (tech.icon) return <BrandSvg icon={tech.icon} className={className} />;
  const Icon = (tech.fallback && fallbacks[tech.fallback]) || Braces;
  return <Icon className={className} strokeWidth={2.2} aria-hidden="true" />;
}
