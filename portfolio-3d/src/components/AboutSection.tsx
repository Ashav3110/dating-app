'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedNumber from './AnimatedNumber';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'Playwright', level: 95, color: 'from-purple-500 to-violet-400' },
  { name: 'API Testing', level: 90, color: 'from-cyan-500 to-blue-400' },
  { name: 'Test Automation', level: 88, color: 'from-pink-500 to-purple-500' },
  { name: 'AI Integration', level: 85, color: 'from-emerald-500 to-cyan-500' },
  { name: 'Bug Tracking', level: 92, color: 'from-orange-400 to-pink-500' },
];

const highlights = [
  { icon: '🚀', title: 'AI-Driven QA', desc: 'Actively using AI tools to generate test cases, build scripts faster, and improve testing efficiency.' },
  { icon: '🛠️', title: 'Custom Tooling', desc: 'Building small tools, scripts, and automation frameworks to optimize the QA lifecycle.' },
  { icon: '🧠', title: 'Problem Solver', desc: 'Strong problem-solving mindset with the ability to identify edge cases and improve processes.' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Text slide in from left
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Skill bars animate
      const bars = barsRef.current?.querySelectorAll('[data-bar]');
      if (bars) {
        bars.forEach((bar) => {
          const level = bar.getAttribute('data-level') || '0';
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: `${level}%`,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: barsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      // Cards stagger
      gsap.fromTo(
        '.highlight-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.highlight-card',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
  }, { scope: sectionRef });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-purple-400 mb-4 block">
            About Me
          </span>
          <h2 className="text-4xl sm:text-5xl font-black">
            More than just<br />
            <span className="gradient-text">testing</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Text & highlights */}
          <div ref={textRef}>
            <p className="text-[#8b9cb6] text-lg leading-relaxed mb-8">
              I am a QA Automation Engineer with a strong problem-solving mindset. I specialize in QA Automation, API Testing, and Test Case Design, bringing robust testing frameworks to ensure software reliability.
            </p>
            <p className="text-[#8b9cb6] text-lg leading-relaxed mb-12">
              I actively leverage AI to speed up testing processes, generate test cases, and build automation scripts faster. When needed, I can also build small tools, scripts, and simple games.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="highlight-card glass-card p-5 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <span className="text-2xl mb-3 block">{h.icon}</span>
                  <h3 className="font-bold text-sm mb-2 text-white group-hover:text-purple-300 transition-colors">
                    {h.title}
                  </h3>
                  <p className="text-xs text-[#8b9cb6] leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Skill bars */}
          <div ref={barsRef} className="glass-card p-8">
            <h3 className="text-lg font-bold mb-8 text-white">Core Skills</h3>
            <div className="flex flex-col gap-6">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{skill.name}</span>
                    <span className="text-xs font-bold text-purple-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      data-bar
                      data-level={skill.level}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
              <div>
                <AnimatedNumber value={150} suffix="+" className="text-2xl font-black gradient-text block" />
                <div className="text-xs text-[#8b9cb6] mt-1">Test Scripts Written</div>
              </div>
              <div>
                <AnimatedNumber value={20} suffix="+" className="text-2xl font-black gradient-text block" />
                <div className="text-xs text-[#8b9cb6] mt-1">Releases Certified</div>
              </div>
              <div>
                <AnimatedNumber value={500} suffix="+" className="text-2xl font-black gradient-text block" />
                <div className="text-xs text-[#8b9cb6] mt-1">Bugs Found</div>
              </div>
              <div>
                <div className="text-2xl font-black gradient-text">∞</div>
                <div className="text-xs text-[#8b9cb6] mt-1">Test Executions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
