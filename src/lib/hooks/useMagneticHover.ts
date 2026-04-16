"use client";

import { useRef, useCallback } from "react";

interface MagneticOptions {
  strength?: number; // 吸附力度，預設 0.3
  radius?: number;   // 感應半徑倍率，預設 1.5
}

export function useMagneticHover(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 1.5 } = options;
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const maxDist = Math.max(rect.width, rect.height) * radius;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < maxDist) {
        const factor = (1 - dist / maxDist) * strength;
        ref.current.style.transform = `translate(${distX * factor}px, ${distY * factor}px)`;
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
    ref.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 500);
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
