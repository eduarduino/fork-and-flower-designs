"use client";

import { useContext, useCallback, useRef } from "react";
import { ForkStabContext } from "@/components/providers/ForkStabProvider";

/**
 * onPointerDown fires on desktop (immediate). If it fired, onClick is
 * suppressed. On mobile where pointerdown can be swallowed, onClick
 * acts as the fallback — guaranteeing exactly one stab per interaction.
 */
export function useForkStab() {
  const triggerStab = useContext(ForkStabContext);
  const pointerFired = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent | React.MouseEvent) => {
      pointerFired.current = true;
      triggerStab?.(e.clientX, e.clientY);
      setTimeout(() => { pointerFired.current = false; }, 400);
    },
    [triggerStab],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (pointerFired.current) return;
      triggerStab?.(e.clientX, e.clientY);
    },
    [triggerStab],
  );

  return { onPointerDown, onClick, triggerStab };
}
