"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { ForkStabContext } from "@/components/providers/ForkStabProvider";
import {
  STAB_DELAY_MS,
  isModifiedActivation,
  prefersReducedMotion,
} from "@/lib/forkAnimation";

interface Handlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

const DRAG_THRESHOLD_PX = 10;

/**
 * Opens a photo only on an intentional tap/click — never on pointer-down.
 *
 * A press that turns into a scroll/drag is ignored: browsers already suppress
 * the synthetic `click` after a real scroll, and the pointer-move guard cancels
 * small jitter that still produces a click. The fork-stab easter egg is
 * preserved by triggering it from the confirmed tap (matching the gallery's
 * existing open animation).
 */
export function usePhotoTap(onOpen: () => void): Handlers {
  const triggerStab = useContext(ForkStabContext);

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    draggedRef.current = false;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const start = startRef.current;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    if (dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX) {
      draggedRef.current = true;
    }
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const wasDragged = draggedRef.current;
      startRef.current = null;
      draggedRef.current = false;

      if (wasDragged) return;
      if (isModifiedActivation(e)) return;

      if (prefersReducedMotion() || !triggerStab) {
        onOpenRef.current();
        return;
      }

      triggerStab(e.clientX, e.clientY);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = setTimeout(() => {
        pendingTimerRef.current = null;
        onOpenRef.current();
      }, STAB_DELAY_MS);
    },
    [triggerStab],
  );

  return { onPointerDown, onPointerMove, onClick };
}
