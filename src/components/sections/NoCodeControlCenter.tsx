'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function NoCodeControlCenter() {
  const { locale } = useLocale();
  const t = translations[locale].caseStudy;
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Dashboard states for "playfulness"
  const [toggle1, setToggle1] = useState(true);
  const [sliderVal, setSliderVal] = useState(70);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nocode" ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

        {/* Text Content */}
        <div ref={contentRef} className={`space-y-8 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${toggle1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="inline-block px-4 py-1 rounded-full border border-bioluminescence/30 text-bioluminescence text-xs font-semibold tracking-widest uppercase bg-bioluminescence/5">
            {t.badge}
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {t.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bioluminescence to-emerald-400">
              {t.titleAccent}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-xl">
            {t.description}
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {[t.feature1, t.feature2, t.feature3, t.feature4].map((f) => (
              <li key={f} className="flex items-center group">
                <div className="w-10 h-10 rounded-xl bg-bioluminescence/10 border border-bioluminescence/20 flex items-center justify-center mr-4 group-hover:bg-bioluminescence/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-bioluminescence animate-ping" />
                </div>
                <span className="text-slate-200 font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Interactive Dashboard UI */}
        <div className={`relative h-[550px] w-full rounded-[2.5rem] overflow-hidden glass-panel transition-all duration-700 ${toggle1 ? 'border-bioluminescence/30 shadow-[0_0_40px_rgba(57,255,20,0.1)]' : 'border-white/5 shadow-2xl filter grayscale-[40%]'}`}>
          {/* Animated Background Glow */}
          <div 
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
            style={{ 
              background: `radial-gradient(circle, rgba(57, 255, 20, ${sliderVal/200}) 0%, transparent 70%)`,
              opacity: toggle1 ? 1 : 0.2,
              transform: `scale(${toggle1 ? 1 : 0.8})`
            }} 
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl z-0" />
          
          {/* Dashboard Header */}
          <div className="relative z-10 h-14 border-b border-white/10 bg-black/20 flex items-center justify-between px-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Master Control v3.0</div>
            <div className="w-10"></div> {/* Spacer to center title */}
          </div>

          <div className="relative z-10 p-8 space-y-8 h-full flex flex-col pt-12">
            
            {/* The Feature Toggle Card */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden ${toggle1 ? 'bg-black/40 border-bioluminescence/40 shadow-[inset_0_0_20px_rgba(57,255,20,0.05)]' : 'bg-white/5 border-white/10'}`}>
              
              {/* Inner Glow for active state */}
              {toggle1 && <div className="absolute inset-0 bg-gradient-to-br from-bioluminescence/5 to-transparent pointer-events-none" />}

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white tracking-wide">Live Content Visibility</h3>
                    <div className={`transition-all duration-300 overflow-hidden flex items-center gap-2 px-2.5 py-0.5 rounded-full border ${toggle1 ? 'opacity-100 max-w-[100px] bg-bioluminescence/10 border-bioluminescence/40' : 'opacity-0 max-w-0 border-transparent overflow-hidden'}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-bioluminescence animate-pulse shadow-[0_0_8px_#39ff14]" />
                      <span className="text-[9px] font-bold text-bioluminescence uppercase tracking-widest whitespace-nowrap">Visible</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Controls the primary site rendering block</p>
                </div>

                {/* Aesthetic Toggle Switch */}
                <button 
                  onClick={() => setToggle1(!toggle1)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none shrink-0 ${toggle1 ? 'bg-bioluminescence shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]' : 'bg-slate-700'}`}
                >
                  <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${toggle1 ? 'transform translate-x-7 shadow-[0_0_10px_white]' : ''}`} />
                </button>
              </div>

              {/* Progress/Data Bars */}
              <div className="mt-6 pt-5 border-t border-white/10 flex space-x-3">
                <div className="h-1.5 w-1/2 bg-black/50 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-700 ease-out bg-gradient-to-r from-bioluminescence/50 to-bioluminescence ${toggle1 ? 'w-full' : 'w-0'}`} />
                </div>
                <div className="h-1.5 w-1/4 bg-black/50 rounded-full"></div>
              </div>
            </div>

            {/* Aesthetic Slider Component */}
            <div className="space-y-4 px-2">
              <div className="flex justify-between text-[10px] uppercase text-slate-400 font-mono tracking-wider">
                <span>System Output Gain</span>
                <span className={toggle1 ? "text-bioluminescence transition-colors" : ""}>{sliderVal}%</span>
              </div>
              <div className="relative group/slider h-6 flex items-center">
                <input 
                  type="range" 
                  min="0" max="100"
                  value={sliderVal} 
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className="absolute z-20 w-full h-full opacity-0 cursor-pointer" 
                  disabled={!toggle1}
                />
                {/* Custom Track */}
                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden relative z-0 border border-white/5">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-75 ease-linear ${toggle1 ? 'bg-bioluminescence' : 'bg-slate-600'}`}
                    style={{ width: `${sliderVal}%` }}
                  />
                </div>
                {/* Custom Thumb */}
                <div 
                  className={`absolute z-10 w-4 h-4 rounded-full border-2 bg-slate-900 transition-all shadow-lg pointer-events-none flex items-center justify-center ${toggle1 ? 'border-bioluminescence shadow-[0_0_10px_#39ff14]' : 'border-slate-500'}`}
                  style={{ left: `calc(${sliderVal}% - 8px)` }}
                >
                  {toggle1 && <div className="w-1 h-1 bg-bioluminescence rounded-full animate-pulse" />}
                </div>
              </div>
            </div>

            {/* Status Modules */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className={`p-4 rounded-xl border border-white/5 bg-black/20 flex items-center gap-3 transition-colors ${toggle1 ? 'hover:bg-white/5' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${toggle1 ? 'border-bioluminescence/30 bg-bioluminescence/10' : 'border-white/10 bg-white/5'}`}>
                  <div className={`w-2 h-2 rounded-full ${toggle1 ? 'bg-bioluminescence animate-ping' : 'bg-slate-600'}`} />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mb-0.5">Core Engine</div>
                  <div className={`text-xs font-bold ${toggle1 ? 'text-white' : 'text-slate-600'}`}>ONLINE</div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border border-white/5 bg-black/20 flex items-center gap-3 transition-colors ${toggle1 ? 'hover:bg-white/5' : ''}`}>
                 <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center border border-white/10 bg-white/5 gap-1">
                  <div className={`w-3 h-0.5 rounded-full ${toggle1 ? 'bg-white/60' : 'bg-slate-700'}`} />
                  <div className={`w-3 h-0.5 rounded-full ${toggle1 ? 'bg-white/60' : 'bg-slate-700'}`} />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-500 font-mono mb-0.5">Database</div>
                  <div className={`text-xs font-bold ${toggle1 ? 'text-white' : 'text-slate-600'}`}>SYNCED</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
