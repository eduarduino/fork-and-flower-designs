"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getForkAsset } from "@/lib/brand";

interface StabInstance {
  id: number;
  x: number;
  y: number;
}

export const ForkStabContext = createContext<
  ((x: number, y: number) => void) | null
>(null);

const FORK_DISPLAY_H = 56;

export function ForkStabProvider({ children }: { children: ReactNode }) {
  const [stabs, setStabs] = useState<StabInstance[]>([]);
  const nextId = useRef(0);
  const forkSrc = getForkAsset();
  const pathname = usePathname();

  useEffect(() => {
    setStabs([]);
  }, [pathname]);

  const forkDisplayW = Math.round(
    FORK_DISPLAY_H * (forkSrc.width / forkSrc.height),
  );

  const triggerStab = useCallback((x: number, y: number) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const id = nextId.current++;
    setStabs((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setStabs((prev) => prev.filter((s) => s.id !== id));
    }, 800);
  }, []);

  return (
    <ForkStabContext.Provider value={triggerStab}>
      {children}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
        aria-hidden
      >
        <AnimatePresence>
          {stabs.map((stab) => (
            <motion.div
              key={stab.id}
              className="absolute"
              style={{
                left: stab.x - forkDisplayW / 2,
                top: stab.y - FORK_DISPLAY_H + 8,
              }}
              initial={{ opacity: 1, y: -12 }}
              animate={{
                opacity: [1, 1, 0],
                y: [-12, 4, 10],
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Image
                src={forkSrc}
                alt=""
                width={forkDisplayW}
                height={FORK_DISPLAY_H}
                style={{ height: FORK_DISPLAY_H, width: forkDisplayW }}
                className="pointer-events-none brightness-0 saturate-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]"
                draggable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ForkStabContext.Provider>
  );
}
