import React, { useRef, CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  accent?: string;
  className?: string;
};

const BASE: CSSProperties = {
  position: "relative",
  background: "#0f1430",
  border: "1px solid rgba(0,217,255,0.10)",
  borderRadius: 10,
  overflow: "hidden",
  transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
};

export default function BentoCard({ children, onClick, style, accent = "#00d9ff", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const dist = Math.hypot(x - cx, y - cy);
    const max = Math.hypot(cx, cy);
    const intensity = Math.max(0, 1 - dist / max);
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
    el.style.setProperty("--glow-intensity", intensity.toFixed(3));
    el.style.boxShadow = `0 0 0 1px rgba(0,217,255,${0.15 + intensity * 0.35}), 0 8px 28px rgba(0,217,255,${intensity * 0.18})`;
    el.style.borderColor = `rgba(0,217,255,${0.15 + intensity * 0.5})`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.boxShadow = "none";
    el.style.borderColor = "rgba(0,217,255,0.10)";
    el.style.setProperty("--glow-intensity", "0");
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ ...BASE, cursor: onClick ? "pointer" : "default", ...style }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(220px circle at var(--glow-x, -200px) var(--glow-y, -200px), ${accent}26, transparent 60%)`,
          opacity: "var(--glow-intensity, 0)" as any,
          transition: "opacity 0.2s",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
