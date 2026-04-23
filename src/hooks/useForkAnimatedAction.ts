"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ForkStabContext } from "@/components/providers/ForkStabProvider";
import {
  STAB_DELAY_MS,
  isModifiedActivation,
  prefersReducedMotion,
} from "@/lib/forkAnimation";

type Options =
  | { mode: "link"; href: string; onBeforeNavigate?: () => void }
  | { mode: "action"; action: (e: React.MouseEvent) => void };

interface Handlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}

export function useForkAnimatedAction(opts: Options): Handlers {
  const triggerStab = useContext(ForkStabContext);
  const router = useRouter();

  const pointerFiredRef = useRef(false);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef(false);

  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    return () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };
  }, []);

  const runAction = useCallback(() => {
    pendingTimerRef.current = null;
    inFlightRef.current = false;
    const current = optsRef.current;
    if (current.mode === "link") {
      current.onBeforeNavigate?.();
      router.push(current.href);
    } else {
      // For action-mode the original event is no longer meaningful after the
      // delay; pass a minimal stub so the signature stays compatible.
      current.action({} as React.MouseEvent);
    }
  }, [router]);

  const fire = useCallback(
    (e: React.PointerEvent | React.MouseEvent) => {
      if (inFlightRef.current) return;
      if (isModifiedActivation(e)) return;

      const current = optsRef.current;
      if (current.mode === "link") {
        e.preventDefault();
      }

      if (prefersReducedMotion()) {
        if (current.mode === "link") {
          current.onBeforeNavigate?.();
          router.push(current.href);
        } else {
          current.action(e as React.MouseEvent);
        }
        return;
      }

      triggerStab?.(e.clientX, e.clientY);
      inFlightRef.current = true;
      pendingTimerRef.current = setTimeout(runAction, STAB_DELAY_MS);
    },
    [router, runAction, triggerStab],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      pointerFiredRef.current = true;
      setTimeout(() => {
        pointerFiredRef.current = false;
      }, 400);
      fire(e);
    },
    [fire],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (pointerFiredRef.current) {
        // Pointerdown already handled this interaction. For link-mode we still
        // need to preventDefault so the browser doesn't navigate immediately.
        if (optsRef.current.mode === "link") e.preventDefault();
        return;
      }
      fire(e);
    },
    [fire],
  );

  return { onPointerDown, onClick };
}
