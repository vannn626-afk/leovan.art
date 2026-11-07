import type { ReactNode } from "react";

type Props = {
  code: string;
  kicker: string;
  title: ReactNode;
  align?: "left" | "right";
  id?: string;
};

/** Persona-style heading: red tag, oversized slanted title, slash underline. */
export function SectionHeading({ code, kicker, title, align = "left", id }: Props) {
  const right = align === "right";
  return (
    <header className={`relative mb-10 md:mb-16 ${right ? "text-right" : ""}`}>
      <div className={`flex items-center gap-3 ${right ? "justify-end" : ""}`} data-reveal={right ? "right" : "left"}>
        <span className="clip-tag bg-blood px-4 py-1 font-mono text-xs font-bold tracking-[0.3em]">{code}</span>
        <span className="font-mono text-xs tracking-[0.35em] text-ash">{kicker}</span>
      </div>
      <h2
        id={id}
        className="font-display mt-4 text-[clamp(3.2rem,11vw,9.5rem)] uppercase -skew-x-6 [text-shadow:6px_6px_0_#990019]"
        data-reveal="slash"
      >
        {title}
      </h2>
      <div
        className={`mt-4 h-2 w-40 -skew-x-[30deg] bg-blood md:w-72 ${right ? "ml-auto" : ""}`}
        data-reveal={right ? "right" : "left"}
        style={{ ["--d" as string]: "0.2s" }}
      />
    </header>
  );
}
