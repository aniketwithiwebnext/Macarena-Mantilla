import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  {
    url: "https://gjoznmzw2bc0wpip.public.blob.vercel-storage.com/DSCF0398.JPG",
    alt: "Inspirational hands writing poetry on textured parchment paper with vintage ink",
    caption: "The Quiet Poetry of Writing"
  },
  {
    url: "https://gjoznmzw2bc0wpip.public.blob.vercel-storage.com/DSCF0196.JPG",
    alt: "Warm chamomile tea steaming beside an open organic leather-bound journal",
    caption: "Slow Morning Rituals"
  },
  {
    url: "https://gjoznmzw2bc0wpip.public.blob.vercel-storage.com/DSCF0327.JPG",
    alt: "Delicate botanical skincare bottles on an elegant tray with morning sunlight highlights",
    caption: "Embracing Minimalist Pastel Glow"
  }
];

export function SlidingHeroImages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right (next), -1 = left (prev)

  // Preload all hero images into browser cache and memory on mount
  useEffect(() => {
    HERO_IMAGES.forEach((image) => {
      const img = new Image();
      img.src = image.url;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  // Variants for sliding transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.8, ease: "easeOut" }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 select-none overflow-hidden bg-cream">
      {/* Dynamic Slide Background Carousel */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Ambient image layer with slow zoom animation */}
            <motion.img
              src={HERO_IMAGES[currentIndex].url}
              alt={HERO_IMAGES[currentIndex].alt}
              className="w-full h-full object-cover opacity-60 filter sepia-[5%] brightness-[0.98]"
              referrerPolicy="no-referrer"
              animate={{ scale: [1, 1.06] }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Elegant Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-pastel-purple/20 via-pastel-pink/15 to-cream/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-cream/20" />

        {/* Subtle sliding captions and manual navigation indicators in the bottom left */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start space-y-2 pointer-events-auto bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm max-w-[280px]">
          <span className="text-[9px] uppercase tracking-wider font-mono text-brand-purple font-bold">
            Active Inspiration
          </span>
          <p className="text-xs font-serif font-bold text-charcoal line-clamp-1">
            {HERO_IMAGES[currentIndex].caption}
          </p>
          <div className="flex items-center gap-2 pt-1 w-full justify-between">
            {/* Quick pagination indicators */}
            <div className="flex gap-1">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? "w-4 bg-brand-purple" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Manual controls */}
            <div className="flex gap-1">
              <button
                onClick={handlePrev}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-purple transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-brand-purple transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden pre-decoder container to prevent flash-on-slide */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        {HERO_IMAGES.map((image) => (
          <img key={image.url} src={image.url} alt="preload" referrerPolicy="no-referrer" />
        ))}
      </div>
    </div>
  );
}

export default SlidingHeroImages;
