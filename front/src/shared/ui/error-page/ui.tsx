import React, { useRef } from "react";
import { motion } from "framer-motion";

export const ErrorPage = ({ errorCode = "404" }) => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const updatePosition = (ref: React.RefObject<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--cursor-x", `${x}px`);
      el.style.setProperty("--cursor-y", `${y}px`);
    };

    updatePosition(h1Ref);
    updatePosition(pRef);
    updatePosition(buttonRef);

    if (bgRef.current) {
      const bgRect = bgRef.current.getBoundingClientRect();
      const bgX = e.clientX - bgRect.left;
      const bgY = e.clientY - bgRect.top;
      bgRef.current.style.setProperty("--bg-x", `${bgX}px`);
      bgRef.current.style.setProperty("--bg-y", `${bgY}px`);
    }
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--cursor-x");
    el.style.removeProperty("--cursor-y");
  };

  return (
    <div
      ref={bgRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#0d1117] flex flex-col items-center justify-center px-4 cursor-none overflow-hidden"
    >
      <style>
        {`
          .hover-spotlight {
            position: relative;
            display: inline-block;
            background: radial-gradient(
              circle 80px at var(--cursor-x, 50%) var(--cursor-y, 50%),
              #a855f7 0%,
              #c9d1d9 60%,
              #c9d1d9 100%
            );
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            transition: background 0.3s ease;
          }

          .bg-glow::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle 120px at var(--bg-x, 50%) var(--bg-y, 50%),
              rgba(255, 255, 255, 0.07) 0%,
              transparent 80%
            );
            pointer-events: none;
            z-index: 1;
          }
        `}
      </style>

      <div className="absolute inset-0 z-0 bg-glow" />

      <div className="relative z-10 text-center px-4 max-w-full pb-32 sm:pb-40">
        <motion.h1
          ref={h1Ref}
          onMouseLeave={() => handleMouseLeave(h1Ref)}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-bold tracking-tighter hover-spotlight leading-none"
        >
          404
        </motion.h1>

        <motion.p
          ref={pRef}
          onMouseLeave={() => handleMouseLeave(pRef)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#8b949e] font-light hover-spotlight mt-2 sm:mt-4"
        >
          {errorCode}
        </motion.p>
      </div>

      <motion.button
        ref={buttonRef}
        onMouseLeave={() => handleMouseLeave(buttonRef)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 sm:bottom-20 z-10 flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 text-white rounded-md transition-all transform hover:scale-105 text-sm sm:text-base md:text-lg font-semibold hover-spotlight"
        onClick={() => window.history.back()}
      >
        ← Go Back
      </motion.button>
    </div>
  );
};