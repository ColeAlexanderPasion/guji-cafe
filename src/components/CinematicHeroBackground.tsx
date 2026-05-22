import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "motion/react";

interface CinematicBackgroundProps {
  isPlaying: boolean;
  isMuted: boolean;
  opacity: number;
}

// Highly stylized SVG vector of a roasted glossy coffee bean
const BeautifulCoffeeBean = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    referrerPolicy="no-referrer"
  >
    <defs>
      <radialGradient id="beanGrad" cx="45%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#6F4E37" />
        <stop offset="60%" stopColor="#3B2314" />
        <stop offset="100%" stopColor="#1E0F08" />
      </radialGradient>
      <linearGradient id="creaseGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1A0D06" />
        <stop offset="50%" stopColor="#50311F" />
        <stop offset="100%" stopColor="#1A0D06" />
      </linearGradient>
      <radialGradient id="goldHighlight" cx="30%" cy="30%" r="40%">
        <stop offset="0%" stopColor="#E2B77C" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#3B2314" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Base Bean Shadow */}
    <ellipse cx="62" cy="65" rx="42" ry="28" fill="black" opacity="0.4" filter="blur(6px)" />
    
    {/* Main Bean Body */}
    <path
      d="M25 60C25 35 45 20 70 20C90 20 100 38 100 60C100 82 85 100 60 100C35 100 25 85 25 60Z"
      fill="url(#beanGrad)"
    />
    
    {/* Glossy highlight accent */}
    <path
      d="M32 50C32 38 43 28 58 25C40 32 32 45 32 60C32 63 33 66 34 68C33 65 32 62 32 50Z"
      fill="white"
      opacity="0.12"
    />
    
    {/* Central organic seed crease with organic wiggle */}
    <path
      d="M30 62C40 60 48 64 56 50C62 38 72 32 88 56C82 66 68 76 58 72C48 68 38 74 30 62Z"
      fill="none"
    />
    <path
      d="M26 60 Q 45 52, 60 60 T 96 60"
      stroke="url(#creaseGrad)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M26 60 Q 45 52, 60 60 T 96 60"
      stroke="#120602"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M45 56 Q 52 50, 65 62"
      stroke="url(#goldHighlight)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function CinematicHeroBackground({
  isPlaying = true,
  isMuted = true,
  opacity = 0.85,
}: CinematicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax displacement states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });

  // Floating Particles configuration
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speedY: number;
    speedX: number;
    opacity: number;
    pulseSpeed: number;
  }>>([]);

  // Floating Beans configuration
  const [beans, setBeans] = useState<Array<{
    id: number;
    x: number;
    y: number;
    scale: number;
    rotateStart: number;
    rotateDirection: number;
    speedY: number;
    speedX: number;
    swayFrequency: number;
    parallaxMultiplier: number;
  }>>([]);

  // Generate randomized elements on mount
  useEffect(() => {
    // Generate 18 glowing amber particles
    const localSavedParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 3,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));
    setParticles(localSavedParticles);

    // Generate 7 floating premium coffee beans in three dimensions
    const localSavedBeans = Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 70,
      scale: Math.random() * 0.45 + 0.25,
      rotateStart: Math.random() * 360,
      rotateDirection: Math.random() > 0.5 ? 1 : -1,
      speedY: -(Math.random() * 0.15 + 0.05),
      speedX: (Math.random() - 0.5) * 0.08,
      swayFrequency: Math.random() * 0.005 + 0.002,
      parallaxMultiplier: Math.random() * 1.5 + 0.5,
    }));
    setBeans(localSavedBeans);
  }, []);

  // Soft smooth mouse position interpolation loop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Map to normalized spectrum [-1, 1]
      const nx = (e.clientX / width) * 2 - 1;
      const ny = (e.clientY / height) * 2 - 1;
      setTargetMousePos({ x: nx, y: ny });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Frame tick simulation for physical drifting elements when isPlaying is active
  useEffect(() => {
    if (!isPlaying) return;

    let frameId: number;
    let tickCount = 0;

    const tick = () => {
      tickCount += 1;

      // Dampened mouse parallax movement
      setMousePos((prev) => {
        const dx = targetMousePos.x - prev.x;
        const dy = targetMousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.06, // Smooth dampening factor
          y: prev.y + dy * 0.06,
        };
      });

      // Update amber particles
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          let updatedY = p.y + p.speedY;
          let updatedX = p.x + p.speedX;

          // Wrap around borders gracefully
          if (updatedY < -10) updatedY = 110;
          if (updatedX < -10 || updatedX > 110) updatedX = Math.random() * 100;

          // Dynamic brightness oscillation
          const targetOpacity = p.opacity + Math.sin(tickCount * p.pulseSpeed) * 0.02;

          return {
            ...p,
            y: updatedY,
            x: updatedX,
            opacity: Math.max(0.1, Math.min(0.9, targetOpacity)),
          };
        })
      );

      // Update drift of coffee beans
      setBeans((prevBeans) =>
        prevBeans.map((b) => {
          let updatedY = b.y + b.speedY;
          // Apply soft horizontal wavy sway using harmonic oscillation
          const sway = Math.sin(tickCount * b.swayFrequency) * 0.07;
          let updatedX = b.x + b.speedX + sway;

          // Wrap borders
          if (updatedY < -15) updatedY = 115;
          if (updatedX < -15) updatedX = 115;
          if (updatedX > 115) updatedX = -15;

          return {
            ...b,
            y: updatedY,
            x: updatedX,
          };
        })
      );

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, targetMousePos]);

  // Static fallback or standard camera scales
  const transformStyleCamera = {
    // Elegant parallax offset mapping
    transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0px) scale(1.04)`,
    transition: "transform 0.1s ease-out",
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-espresso z-0"
      style={{ opacity }}
    >
      {/* 1. Core Generative High-Resolution Base Image with slow looping camera push-in and liquid ripples */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={transformStyleCamera}
        animate={
          isPlaying
            ? {
                scale: [1.02, 1.07, 1.02],
              }
            : { scale: 1.02 }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="/src/assets/images/cinematic_coffee_hero_1779435548186.png"
          alt="Cinematic gourmet coffee splash backdrop"
          className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.08]"
          referrerPolicy="no-referrer"
          
          style={{
            // Dynamic subtle SVG displacement or heat shimmer look using inline CSS filters if supported
            filter: "brightness(0.72) contrast(1.08) url(#heatShimmerFilter)",
          }}
        />
      </motion.div>

      {/* SVG Liquid Heat Filter to simulate subtle liquid crown rippling and steam shimmer */}
      <svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="heatShimmerFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.008"
              numOctaves="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.012 0.008; 0.016 0.012; 0.012 0.008"
                dur="10s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>
        </defs>
      </svg>

      {/* 2. BACKGROUND LAYER: Warm Golden Bokeh particle circles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
        {particles.slice(0, 10).map((pt) => {
          const parallaxX = mousePos.x * -25;
          const parallaxY = mousePos.y * -25;

          return (
            <div
              key={`bokeh-bg-${pt.id}`}
              className="absolute rounded-full pointer-events-none bg-gradient-to-r from-[#E2B77C]/20 to-[#C8915B]/5 blur-lg border border-[#E2B77C]/10"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: `${pt.size * 5}px`,
                height: `${pt.size * 5}px`,
                opacity: pt.opacity * 0.45,
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0px)`,
                willChange: "transform",
              }}
            />
          );
        })}
      </div>

      {/* 3. CORE INTERACTIVE LAYER: Soft Drifting Steam Wisps Rising */}
      <div className="absolute inset-0 pointer-events-none z-15 flex justify-center items-end mix-blend-screen">
        <svg
          className="w-full max-w-[650px] h-[75vh] opacity-35"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="steamGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#D8C6B2" stopOpacity="0" />
              <stop offset="25%" stopColor="#E2B77C" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F7EFE5" stopOpacity="0.2" />
              <stop offset="75%" stopColor="#F7EFE5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Steam Strand 1 */}
          <motion.path
            d="M180 500 C150 420 220 300 170 200 C130 110 240 50 190 10"
            stroke="url(#steamGradient)"
            strokeWidth="35"
            strokeLinecap="round"
            fill="none"
            animate={
              isPlaying
                ? {
                    d: [
                      "M180 500 C150 420 220 300 170 200 C130 110 240 50 190 10",
                      "M190 500 C165 400 195 320 185 190 C160 120 210 60 180 10",
                      "M180 500 C150 420 220 300 170 200 C130 110 240 50 190 10",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Steam Strand 2 */}
          <motion.path
            d="M 220 490 C 240 400 160 330 210 220 C 240 130 170 70 205 15"
            stroke="url(#steamGradient)"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
            animate={
              isPlaying
                ? {
                    d: [
                      "M 220 490 C 240 400 160 330 210 220 C 240 130 170 70 205 15",
                      "M 210 490 C 220 420 180 300 200 240 C 220 150 190 80 215 15",
                      "M 220 490 C 240 400 160 330 210 220 C 240 130 170 70 205 15",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* 4. CHRONO PARALLAX COFFEE BEANS & SPARKLES HIGHLIGHTS */}
      <div className="absolute inset-0 pointer-events-none z-18">
        {/* Render animated floating coffee beans with physical spatial parallax */}
        {beans.map((bn) => {
          // Unique rotation metrics
          const rotateValue = bn.rotateStart + (isPlaying ? 360 : 0) * bn.rotateDirection;
          
          // Different elements have distinct horizontal mouse-displacements, creating authentic 3D spatial depth
          const parallaxX = mousePos.x * -42 * bn.parallaxMultiplier;
          const parallaxY = mousePos.y * -42 * bn.parallaxMultiplier;

          return (
            <motion.div
              key={`bean-${bn.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${bn.x}%`,
                top: `${bn.y}%`,
                width: `${bn.scale * 150}px`,
                height: `${bn.scale * 150}px`,
                zIndex: bn.scale > 0.5 ? 25 : 12, // Larger beans sit on foreground layers
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0px)`,
                willChange: "transform",
              }}
              animate={
                isPlaying
                  ? {
                      rotate: rotateValue,
                      y: [0, -12, 0],
                    }
                  : {}
              }
              transition={{
                rotate: {
                  duration: 24 + bn.id * 4,
                  repeat: Infinity,
                  ease: "linear",
                },
                y: {
                  duration: 6 + bn.id,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <BeautifulCoffeeBean className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.65)]" />
            </motion.div>
          );
        })}

        {/* Floating Sparks Front Layer */}
        {particles.slice(10).map((pt) => {
          const parallaxX = mousePos.x * -55;
          const parallaxY = mousePos.y * -55;

          return (
            <div
              key={`spark-${pt.id}`}
              className="absolute rounded-full pointer-events-none bg-[#E2B77C] shadow-[0_0_10px_#E2B77C] blur-[0.4px]"
              style={{
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: `${pt.size * 0.75}px`,
                height: `${pt.size * 0.75}px`,
                opacity: pt.opacity,
                transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0px)`,
                willChange: "transform",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
