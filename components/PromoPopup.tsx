"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PANEL_URL } from "@/lib/constants";

const STORAGE_KEY = "welcomeBonusPopupSeen";

export const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(27 * 60 + 56); // 27:56 in seconds

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
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-md mt-100px">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-[420px] mx-4 bg-black border border-yellow-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.15)]"
            style={{ marginTop: "120px" }}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="p-6 text-center relative z-10 mt-10px">
              <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-2 w-16 h-16 text-5xl flex justify-center items-center drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              >
                🎁
              </motion.div>

              <h2 className="text-white text-xs tracking-[3px] font-medium mb-1">LIMITED TIME OFFER</h2>
              
              <div className="flex justify-center uppercase overflow-hidden mb-1">
                {"WELCOME BONUS".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.04 }}
                    className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent transform scale-y-110"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="relative text-6xl font-black text-yellow-500 mb-3 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
              >
                {/* Subtle light rays/glow behind 100% */}
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-150 -z-10"></div>
                100%
              </motion.div>

              <p className="text-gray-300 text-sm mb-4">On your first deposit!</p>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-base sm:text-lg font-semibold text-white mb-6"
              >
                Get <span className="text-yellow-400">100% Bonus</span> credited instantly<br />
                to your trading account!
              </motion.p>

              {/* Urgency */}
              <div className="mb-6">
                <p className="text-red-400 flex items-center justify-center gap-2 text-xs mb-2 font-semibold tracking-wide">
                  ⚡ HURRY! Offer ends in:
                </p>
                <motion.div 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block bg-[#0f0f0f] border border-yellow-500/50 rounded-xl px-8 py-3 text-3xl font-mono font-bold text-yellow-400 tracking-widest shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
                >
                  {formattedTime}
                </motion.div>
              </div>

              {/* Claim Button */}
              <motion.a
                href={PANEL_URL}
                onClick={() => window.localStorage.setItem(STORAGE_KEY, "true")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #facc15", filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold text-lg tracking-wider shadow-xl block text-center"
              >
                Claim Now
              </motion.a>

              <p className="text-gray-500 text-[10px] sm:text-xs mt-4">
                Don't miss out - limited spots available!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
