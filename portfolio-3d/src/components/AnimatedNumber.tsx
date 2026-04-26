'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!numberRef.current || !containerRef.current) return;

    // We animate a dummy object and inject its value onUpdate.
    const counter = { val: 0 };
    
    gsap.to(counter, {
      val: value,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        if (numberRef.current) {
          // Format based on integer vs float, but we assume integers generally for stats
          numberRef.current.innerText = Math.round(counter.val).toString();
        }
      },
    });
  }, { scope: containerRef });

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      <span ref={numberRef}>0</span>
      {suffix}
    </span>
  );
}
