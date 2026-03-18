'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export function CircuitTrace() {
  const [active, setActive] = useState(false);
  const [pathData, setPathData] = useState("");
  const [docHeight, setDocHeight] = useState(100);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleTrigger = () => {
      const footerLink = document.getElementById('footer-contact-link');
      const inquiryBox = document.getElementById('architecture-inquiry-box');
      
      if (footerLink && inquiryBox) {
        const startRect = footerLink.getBoundingClientRect();
        const endRect = inquiryBox.getBoundingClientRect();
        
        const sy = window.scrollY;
        
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + sy;
        
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.bottom + sy + 20;

        setDocHeight(document.documentElement.scrollHeight);

        const midY = startY - 80;
        
        // A stepped circuit path
        const path = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
        setPathData(path);
        setActive(true);
        
        setTimeout(() => setActive(false), 2500);
      }
    };

    window.addEventListener('trigger-circuit-trace', handleTrigger);
    return () => window.removeEventListener('trigger-circuit-trace', handleTrigger);
  }, []);

  useEffect(() => {
    if (active && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      
      gsap.fromTo(pathRef.current,
        { strokeDasharray: length, strokeDashoffset: length, opacity: 1 },
        { 
          strokeDashoffset: 0, 
          duration: 1.2, 
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.to(pathRef.current, { opacity: 0, duration: 0.5, delay: 0.3 });
          }
        }
      );
    }
  }, [active, pathData]);

  if (!active) return null;

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none z-[100]" style={{ height: docHeight }}>
      <svg ref={svgRef} className="w-full h-full">
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="#39FF14"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="filter drop-shadow-[0_0_12px_#39FF14]"
        />
        {/* Animated payload packet */}
        <circle r="6" fill="#ffffff" className="filter drop-shadow-[0_0_15px_#ffffff]">
           <animateMotion
             dur="1.2s"
             repeatCount="1"
             path={pathData}
             calcMode="spline"
             keySplines="0.45 0 0.55 1"
             fill="freeze"
           />
        </circle>
      </svg>
    </div>
  );
}
