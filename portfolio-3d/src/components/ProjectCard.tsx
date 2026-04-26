'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  accent: string;
  emoji: string;
  href?: string;
  index: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  gradient,
  accent,
  emoji,
  href = '#',
  index,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  });
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative rounded-2xl overflow-hidden cursor-pointer group h-full"
      >
        {/* Card background */}
        <div className="absolute inset-0 bg-[#0d1117] border border-white/8 rounded-2xl" />

        {/* Gradient header */}
        <div className={`relative h-52 ${gradient} flex items-center justify-center overflow-hidden`}>
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* Floating emoji */}
          <motion.span
            className="text-6xl select-none relative z-10"
            style={{ transform: 'translateZ(30px)' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
          >
            {emoji}
          </motion.span>

          {/* Glow follow mouse */}
          <motion.div
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-50 pointer-events-none"
            style={{
              background: accent,
              left: glowX,
              top: glowY,
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        </div>

        {/* Card content */}
        <div className="relative p-6" style={{ transform: 'translateZ(10px)' }}>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-[#8b9cb6] leading-relaxed mb-5">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[#8b9cb6] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors group/link"
            onClick={(e) => e.preventDefault()}
          >
            View Project
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </a>
        </div>

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-hover:border-purple-500/30 transition-all duration-500 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
