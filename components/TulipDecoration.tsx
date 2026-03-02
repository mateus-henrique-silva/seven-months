"use client";

import { motion } from "framer-motion";

function TulipSVG({
  size = 80,
  opacity = 0.4,
  delay = 0,
}: {
  size?: number;
  opacity?: number;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 60 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      animate={{ rotate: [-5, 5] }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 4,
        delay,
        ease: "easeInOut",
      }}
    >
      {/* Stem */}
      <path
        d="M 30 96 Q 30 70 30 50"
        stroke="#D4E8D0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Leaf left */}
      <path
        d="M 30 75 Q 15 65 12 55 Q 20 60 30 70"
        fill="#D4E8D0"
        stroke="#C0D9BB"
        strokeWidth="1"
      />
      {/* Leaf right */}
      <path
        d="M 30 68 Q 45 58 48 48 Q 40 53 30 63"
        fill="#D4E8D0"
        stroke="#C0D9BB"
        strokeWidth="1"
      />
      {/* Tulip petals - outer left */}
      <path
        d="M 30 50 Q 10 40 10 18 Q 20 8 30 12"
        fill="white"
        stroke="#F0F0F0"
        strokeWidth="1"
      />
      {/* Tulip petals - outer right */}
      <path
        d="M 30 50 Q 50 40 50 18 Q 40 8 30 12"
        fill="white"
        stroke="#F0F0F0"
        strokeWidth="1"
      />
      {/* Tulip petals - center */}
      <path
        d="M 30 50 Q 22 35 24 12 Q 30 4 36 12 Q 38 35 30 50"
        fill="white"
        stroke="#F0F0F0"
        strokeWidth="1"
      />
      {/* Center detail */}
      <path
        d="M 30 48 Q 30 30 30 15"
        stroke="#F5F0FF"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </motion.svg>
  );
}

export function TulipCornerTopLeft() {
  return (
    <div className="pointer-events-none fixed left-0 top-0 z-0 overflow-hidden">
      <div className="flex gap-2 -translate-x-4 -translate-y-4">
        <TulipSVG size={70} opacity={0.25} delay={0} />
        <TulipSVG size={85} opacity={0.3} delay={0.8} />
        <TulipSVG size={60} opacity={0.2} delay={1.6} />
      </div>
    </div>
  );
}

export function TulipCornerTopRight() {
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-0 overflow-hidden">
      <div className="flex gap-2 translate-x-4 -translate-y-4 flex-row-reverse">
        <TulipSVG size={70} opacity={0.25} delay={0.4} />
        <TulipSVG size={85} opacity={0.3} delay={1.2} />
        <TulipSVG size={60} opacity={0.2} delay={2.0} />
      </div>
    </div>
  );
}

export function TulipRow({ count = 5 }: { count?: number }) {
  return (
    <div className="pointer-events-none flex justify-center gap-4 py-2 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <TulipSVG
          key={i}
          size={50 + (i % 3) * 10}
          opacity={0.2 + (i % 3) * 0.05}
          delay={i * 0.4}
        />
      ))}
    </div>
  );
}

export default function TulipDecoration() {
  return (
    <>
      <TulipCornerTopLeft />
      <TulipCornerTopRight />
    </>
  );
}
