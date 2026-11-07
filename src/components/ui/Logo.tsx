import type { SVGProps } from "react";

/**
 * LEOVAN LV monogram — original geometry. The same polygon coordinates are
 * used to extrude the 3D monogram (see three/LVMonogram.tsx).
 */
export const LV_L_POINTS = "10,25 50,10 50,185 150,185 130,225 10,225";
export const LV_V_POINTS = "75,25 110,25 157,145 200,10 235,10 175,170 139,170";

type MarkProps = SVGProps<SVGSVGElement> & { lColor?: string; vColor?: string; animated?: boolean };

export function LVMark({ lColor = "#FFFFFF", vColor = "#E60023", animated = false, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 245 235" role="img" aria-label="LEOVAN LV monogram" {...props}>
      <polygon
        points={LV_L_POINTS}
        style={{ color: lColor }}
        fill={animated ? "transparent" : lColor}
        stroke={animated ? lColor : "none"}
        strokeWidth={animated ? 5 : 0}
        strokeLinejoin="miter"
        className={animated ? "lv-draw" : undefined}
      />
      <polygon
        points={LV_V_POINTS}
        style={{ color: vColor }}
        fill={animated ? "transparent" : vColor}
        stroke={animated ? vColor : "none"}
        strokeWidth={animated ? 5 : 0}
        strokeLinejoin="miter"
        className={animated ? "lv-draw lv-draw-2" : undefined}
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LVMark className="h-7 w-auto" />
      <span className="font-display text-2xl tracking-[0.12em]">
        LEO<span className="text-blood">VAN</span>
      </span>
    </span>
  );
}
