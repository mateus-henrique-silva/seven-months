"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const messages = [
  "Au au! Vocês são lindos juntos! 🐾",
  "Isabella me dá biscoito, então ela é minha favorita! 🦴",
  "Mateus, você é o melhor dono imaginário! 🐶",
  "7 meses de amor! Eu fui testemunha de tudo! 🐕",
  "Estou aqui pra guardar vocês! 💕",
  "Au! Que história bonita a de vocês! 🌸",
  "Sou a Charlotte! A cachorrinha mais feliz do mundo! 🐾",
];

function CockerSpanielSVG({ isHovered }: { isHovered: boolean }) {
  return (
    <svg
      width="110"
      height="140"
      viewBox="0 0 110 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail - animated */}
      <motion.path
        d="M 82 95 Q 105 75 100 55"
        stroke="#8B5E0A"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        animate={isHovered ? { rotate: [-25, 25] } : { rotate: [-15, 15] }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: isHovered ? 0.2 : 0.5,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "82px 95px" }}
      />

      {/* Body */}
      <ellipse cx="55" cy="105" rx="34" ry="28" fill="#C9860A" />

      {/* Chest white patch */}
      <ellipse cx="55" cy="100" rx="16" ry="18" fill="#F5E6C8" />

      {/* Head */}
      <circle cx="55" cy="60" r="27" fill="#C9860A" />

      {/* Left ear */}
      <ellipse
        cx="31"
        cy="70"
        rx="14"
        ry="30"
        fill="#7B4F1A"
        transform="rotate(-12 31 60)"
      />

      {/* Right ear */}
      <ellipse
        cx="79"
        cy="70"
        rx="14"
        ry="30"
        fill="#7B4F1A"
        transform="rotate(12 79 60)"
      />

      {/* Left eye white */}
      <circle cx="44" cy="57" r="8" fill="white" />
      {/* Left eye */}
      <circle cx="44" cy="57" r="5.5" fill="#1A0800" />
      {/* Left eye shine */}
      <circle cx="46" cy="55" r="2" fill="white" />

      {/* Right eye white */}
      <circle cx="66" cy="57" r="8" fill="white" />
      {/* Right eye */}
      <circle cx="66" cy="57" r="5.5" fill="#1A0800" />
      {/* Right eye shine */}
      <circle cx="68" cy="55" r="2" fill="white" />

      {/* Muzzle */}
      <ellipse cx="55" cy="72" rx="14" ry="9" fill="#E8A040" />

      {/* Nose */}
      <ellipse cx="55" cy="68" rx="7" ry="4.5" fill="#0A0000" />
      {/* Nose shine */}
      <ellipse cx="53" cy="67" rx="2" ry="1.2" fill="#3D1A00" />

      {/* Mouth */}
      <path
        d="M 48 75 Q 55 81 62 75"
        stroke="#0A0000"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Front left leg */}
      <rect x="38" y="124" width="13" height="20" rx="6" fill="#C9860A" />
      {/* Front right leg */}
      <rect x="60" y="124" width="13" height="20" rx="6" fill="#C9860A" />

      {/* Collar */}
      <rect x="38" y="82" width="34" height="7" rx="3.5" fill="#FF8FAB" />
      {/* Collar tag */}
      <circle cx="55" cy="91" r="4" fill="#FFD700" />
      <text x="55" y="94" textAnchor="middle" fill="#C9860A" fontSize="4" fontWeight="bold">
        C
      </text>
    </svg>
  );
}

export default function Charlotte() {
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);

  const handleClick = () => {
    setMessage(messages[msgIndex]);
    setMsgIndex((prev) => (prev + 1) % messages.length);
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="mb-2 mr-2 max-w-[200px] rounded-2xl rounded-br-none bg-white px-4 py-3 shadow-lg border border-pink-200"
          >
            <p className="text-sm text-pink-700 font-nunito leading-relaxed">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="cursor-pointer select-none"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
        }}
        title="Charlotte diz: Clique em mim! 🐾"
      >
        <CockerSpanielSVG isHovered={isHovered} />
      </motion.div>

      <p className="text-center text-xs text-pink-400 mt-1 font-nunito">
        Charlotte 🐾
      </p>
    </div>
  );
}
