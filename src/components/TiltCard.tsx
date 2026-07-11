import React, { useRef, useState, ReactNode } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  key?: any;
}

export default function TiltCard({ children, className = "", id, onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Elastic spring options for premium smooth feel
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  // Spotlight highlight reflection coordinate spring
  const shineX = useSpring(-100, springConfig);
  const shineY = useSpring(-100, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Center coordinates
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate normalized coords (-0.5 to 0.5)
    const normalizedX = mouseX / width - 0.5;
    const normalizedY = mouseY / height - 0.5;

    // Rotate cards up to 14 degrees for immersive 3D depth
    rotateX.set(-normalizedY * 16);
    rotateY.set(normalizedX * 16);
    scale.set(1.025);

    // Shine coordinates (percent from 0 to 100)
    shineX.set((mouseX / width) * 100);
    shineY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    shineX.set(-100);
    shineY.set(-100);
  };

  // Convert shine coords to linear-gradient background percentage
  const shineBackground = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(circle 180px at ${x}% ${y}%, rgba(255, 255, 255, 0.12) 0%, transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale,
      }}
      className={`relative rounded-2xl overflow-hidden cursor-default border border-slate-800 bg-navy-900/65 backdrop-blur-md transition-colors duration-300 ${
        isHovered ? "border-blue-500/50" : "border-slate-800/80"
      } ${className}`}
    >
      {/* Glossy reflection glow overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: shineBackground,
        }}
      />
      
      {/* Content wrapper with translateZ for inner 3D parallax layers if wanted */}
      <div className="relative z-0 h-full w-full preserve-3d" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
