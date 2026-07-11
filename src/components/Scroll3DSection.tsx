import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface Scroll3DSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Scroll3DSection({ children, className = "", id }: Scroll3DSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track the element's intersection and scroll position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"],
  });

  // Smooth springs to filter out jitter and provide inertia
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  
  // Transform scroll position to 3D angles, scales, and opacity
  const rotateXRaw = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const scaleRaw = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 0.93]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);
  const translateZRaw = useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, -100]);
  const translateYRaw = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  // Apply spring filter
  const rotateX = useSpring(rotateXRaw, springConfig);
  const scale = useSpring(scaleRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);
  const translateZ = useSpring(translateZRaw, springConfig);
  const translateY = useSpring(translateYRaw, springConfig);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`perspective-1000 w-full py-16 md:py-24 ${className}`}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          scale,
          opacity,
          translateZ,
          translateY,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
