"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PANEL_URL, PANEL_URL_REGISTER } from "@/lib/constants";

const STORAGE_KEY = "welcomeBonusPopupSeen";

const TIERS = [
  { deposit: 500, match: 500 },
  { deposit: 1000, match: 1000 },
  { deposit: 5000, match: 5000 },
];

export const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(27 * 60 + 56); // 27:56 in seconds
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeTierIndex, setActiveTierIndex] = useState(1); // Default is $1000 tier

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Calculate 3D tilt angles (range: -5 to 5 degrees)
    const tiltX = ((y / rect.height) - 0.5) * -8; // Pitch (tilt on X axis based on Y pos)
    const tiltY = ((x / rect.width) - 0.5) * 8;   // Yaw (tilt on Y axis based on X pos)
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay to ensure smooth hydration and entrance
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    window.localStorage.setItem(STORAGE_KEY, "true");
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Use document body style to prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/30 backdrop-blur-3xl backdrop-saturate-[180%] overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          {/* Subtle frosted glass dot matrix texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60 z-0"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px"
            }}
          />

          {/* Viewport-wide Liquid Glow Blobs */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Blob 1: Giant Liquid Gold */}
            <motion.div
              animate={{
                x: [-150, 150, -50, -150],
                y: [-80, 80, 120, -80],
                scale: [1, 1.25, 0.9, 1],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#C9A227]/10 blur-[130px]"
            />
            {/* Blob 2: Giant Violet/Indigo */}
            <motion.div
              animate={{
                x: [150, -150, 80, 150],
                y: [100, -100, -120, 100],
                scale: [0.9, 1.2, 1.05, 0.9],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#6366F1]/8 blur-[120px]"
            />
            {/* Blob 3: Giant Cyan/Teal (Refraction highlight) */}
            <motion.div
              animate={{
                x: [-100, 100, -80, -100],
                y: [120, -120, 80, 120],
                scale: [0.95, 1.15, 0.9, 0.95],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-[#06B6D4]/6 blur-[110px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[420px] mx-4 rounded-3xl overflow-hidden border border-white/[0.12] backdrop-blur-3xl backdrop-saturate-[190%] shadow-[0_32px_96px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.1)] z-10 max-h-[92vh] overflow-y-auto sm:max-h-none sm:overflow-visible"
            style={{
              transform: isHovered
                ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s ease",
              background: isHovered
                ? `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), transparent 75%), rgba(255, 255, 255, 0.08)`
                : "rgba(255, 255, 255, 0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Internal Refractive Liquid Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <motion.div
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -35, 20, 0],
                  scale: [1, 1.15, 0.9, 1]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[#C9A227]/8 blur-[45px]"
              />
              <motion.div
                animate={{
                  x: [0, -30, 20, 0],
                  y: [0, 35, -20, 0],
                  scale: [1, 1.2, 0.85, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-[#6366F1]/6 blur-[50px]"
              />
            </div>

            <div className="p-6 text-center relative z-10">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-white/50 hover:text-white text-lg leading-none w-8 h-8 rounded-full border border-white/0 hover:border-white/10 hover:bg-white/5 flex items-center justify-center transition-all duration-300 z-50"
                aria-label="Close"
              >
                ×
              </button>

              {/* Crystal Star Crest */}
              <div className="mx-auto mb-4 w-16 h-16 relative flex items-center justify-center">
                {/* Outer rotating crystal border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-[#C9A227]/20 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-[2px]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1.5 rounded-full border border-dashed border-[#C9A227]/40"
                />
                <div className="absolute inset-3 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <svg className="w-5 h-5 text-[#E6C655] drop-shadow-[0_0_4px_rgba(230,198,85,0.5)]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
              </div>

              <span className="text-[#E6C655] text-[10px] tracking-[0.25em] font-semibold font-mono block mb-2 uppercase drop-shadow-[0_0_4px_rgba(230,198,85,0.15)]">
                Exclusive Welcome Offer
              </span>

              <div
                style={{ fontFamily: 'var(--font-bebas), sans-serif' }}
                className="flex justify-center uppercase overflow-hidden mb-1 text-3xl sm:text-4xl tracking-[0.05em] font-normal"
              >
                {"WELCOME BONUS".split("").map((char, index) => {
                  const isBonus = index >= 8; // "WELCOME " is 8 chars (including space)
                  return (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.03, type: "spring", stiffness: 150 }}
                      className={isBonus ? "text-[#E6C655] drop-shadow-[0_0_8px_rgba(230,198,85,0.25)]" : "text-white"}
                      style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
                className="relative my-4 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-[#C9A227]/15 blur-3xl rounded-full scale-125 -z-10"></div>
                <span className="text-6xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-[#FFFFFF] via-[#E6C655] to-[#C9A227] bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(201,162,39,0.2)]">
                  100%
                </span>

              </motion.div>

              <p className="text-white/80 text-[10px] tracking-wider uppercase font-mono mb-3">
                Select Deposit Tier
              </p>

              {/* Interactive Selector Pills */}
              <div className="flex justify-center gap-2 mb-3.5">
                {TIERS.map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTierIndex(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 border ${activeTierIndex === idx
                        ? "bg-[#E6C655]/20 border-[#E6C655] text-white shadow-[0_0_12px_rgba(230,198,85,0.25)]"
                        : "bg-white/[0.03] border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.08]"
                      }`}
                  >
                    ${tier.deposit.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Interactive Formula Card */}
              <div className="mb-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between text-xs font-mono select-none">
                <div className="text-left">
                  <span className="text-[9px] text-white/60 block uppercase">Deposit</span>
                  <span className="text-white font-bold">${TIERS[activeTierIndex].deposit.toLocaleString()}</span>
                </div>
                <div className="text-white/50 text-[10px]">+</div>
                <div className="text-center">
                  <span className="text-[9px] text-white/60 block uppercase">100% Match</span>
                  <span className="text-[#E6C655] font-bold">+${TIERS[activeTierIndex].match.toLocaleString()}</span>
                </div>
                <div className="text-white/50 text-[10px]">=</div>
                <div className="text-right">
                  <span className="text-[9px] text-white/60 block uppercase">Trading Capital</span>
                  <span className="text-white font-bold bg-[#E6C655]/15 px-2 py-0.5 rounded border border-[#E6C655]/30 shadow-inner">
                    ${(TIERS[activeTierIndex].deposit + TIERS[activeTierIndex].match).toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-white/80 leading-relaxed max-w-sm mx-auto mb-5"
              >
                Double your trading capital instantly. Claim a <span className="text-[#E6C655] font-semibold">100% trading bonus</span> on your first funding — deposit up to $10,000 to get a 1:1 match.
              </motion.p>

              {/* Status and Countdown (Nested Glass Card) */}
              <div className="mb-6 p-4 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl flex items-center justify-between text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div>
                  <span className="text-[10px] text-white/60 font-mono tracking-wider block uppercase">Offer Type</span>
                  <span className="text-xs text-[#E6C655] font-semibold flex items-center gap-2 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6C655]/70 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6C655]"></span>
                    </span>
                    Instant 1:1 Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/60 font-mono tracking-wider block uppercase">Time Remaining</span>
                  <span className="font-mono text-base font-bold text-white tracking-widest mt-0.5 block">{formattedTime}</span>
                </div>
              </div>

              {/* Claim Button */}
              <motion.a
                href={PANEL_URL_REGISTER}
                onClick={() => window.localStorage.setItem(STORAGE_KEY, "true")}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.98 }}
                className="relative block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E6C655] text-black font-semibold text-sm tracking-[0.1em] uppercase shadow-[0_0_20px_rgba(201,162,39,0.25)] hover:shadow-[0_0_35px_rgba(201,162,39,0.5)] transition-all overflow-hidden text-center cursor-pointer"
              >
                {/* Glossy top highlight */}
                <div className="absolute inset-x-0 top-0 h-[40%] bg-white/20 rounded-t-xl" />

                {/* Moving shine reflection on hover */}
                <motion.div
                  variants={{
                    initial: { x: "-100%" },
                    hover: { x: "100%" }
                  }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                <span className="relative z-10">Secure Welcome Bonus</span>
              </motion.a>

              <p className="text-white/50 text-[10px] mt-4 leading-normal max-w-xs mx-auto">
                Forex and CFDs involve high risk. Restricted to verified new accounts. Terms and conditions apply.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

