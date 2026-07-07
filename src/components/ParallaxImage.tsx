import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function ParallaxImage({ src, alt, className = "", containerClassName = "" }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll position of the element relative to the window viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress (0 to 1) to translateY percentage
  // Shift the image subtly on scroll to create a luxury parallax depth
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.25 }}
        whileHover={{ scale: 1.32 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default ParallaxImage;
