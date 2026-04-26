'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedNumber from './AnimatedNumber';

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Tag bounce animation on load
    if (tagRef.current) {
      gsap.fromTo(
        tagRef.current,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.15 }
      );
    }


  }, { scope: sectionRef });

  const handleScrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
        {/* Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <span
              ref={tagRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Available for projects
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
          >
            Expert QA{' '}
            <span className="gradient-text">Automation</span>
            <br />
            Engineer
            <br />
            <span className="text-[#8b9cb6]">Playwright Specialist</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[#8b9cb6] text-lg leading-relaxed max-w-md"
          >
            QA Automation Engineer with 2 years of experience. I specialize in Playwright, API Testing, and leveraging AI tools to build automation scripts faster and smarter.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="glow-btn text-base"
            >
              View My Work
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-full border border-white/10 text-white font-semibold hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300"
            >
              Get in Touch
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-8 pt-4 border-t border-white/5"
          >
            <div className="flex flex-col">
              <AnimatedNumber value={100} suffix="+" className="text-2xl font-black gradient-text" />
              <span className="text-xs text-[#8b9cb6] font-medium mt-0.5">Test Suites Built</span>
            </div>
            <div className="flex flex-col">
              <AnimatedNumber value={2} suffix="yr" className="text-2xl font-black gradient-text" />
              <span className="text-xs text-[#8b9cb6] font-medium mt-0.5">Experience</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black gradient-text">∞</span>
              <span className="text-xs text-[#8b9cb6] font-medium mt-0.5">Bugs Squashed</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Torus Knot Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className="relative w-full h-[420px] lg:h-[580px]"
        >
          <ThreeScene showStars showShadow />
          {/* Glow underneath */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.25) 0%, transparent 70%)' }} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8b9cb6] text-xs font-medium tracking-widest uppercase hover:text-white transition-colors"
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent"
        />
      </motion.button>
    </section>
  );
}
