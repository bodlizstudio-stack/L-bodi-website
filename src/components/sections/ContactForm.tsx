'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { useLocale } from '../../context/LocaleContext';
import { translations } from '../../lib/translations';

gsap.registerPlugin(ScrollTrigger);

export function ContactForm() {
  const { locale } = useLocale();
  const t = translations[locale].contact;
  const questions = useMemo(() => [
    { id: 1, label: t.q1, placeholder: t.placeholder, type: 'text' },
    { 
      id: 2, 
      label: t.q2, 
      placeholder: t.placeholder2, 
      type: 'select',
      options: [
        { label: 'Basic Growth ($600 - $1.5k)', value: '600-1500' },
        { label: 'Business Expansion ($1.8k - $4k)', value: '1800-4000' },
        { label: 'Full Ecosystem ($5k+)', value: '5000+' }
      ]
    },
    { id: 3, label: t.q3, placeholder: t.placeholder3, type: 'text' },
    { id: 4, label: t.q4, placeholder: t.placeholder4, type: 'text' },
  ], [locale, t]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      // Final submission logic
      setStep(step + 1);
      
      try {
        const formData = new FormData();
        Object.entries(answers).forEach(([key, value]) => {
          formData.append(`answers[${key}]`, value);
        });
        
        if (file) {
          formData.append('file', file);
        }

        const response = await fetch('/api/contact', { 
          method: 'POST', 
          body: formData 
        });
        
        const data = await response.json();
        console.log('Submission result:', data);
      } catch (err) {
        console.error('Submission failed', err);
      }
    }
  };

  return (
    <section id="contact" ref={containerRef} className="relative py-24 md:py-40 flex items-center justify-center z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-bioluminescence/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-4xl px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Architecture<br />
                <span className="text-bioluminescence">Inquiry</span>.
              </h2>
              <p className="text-slate-400 font-light leading-relaxed">
                Provide the blueprints of your vision. Our engineers will analyze your technical requirements and provide a high-performance prototype.
              </p>
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-bioluminescence text-xs">@</div>
                  <span className="text-sm font-mono">bodlizstudio@gmail.com</span>
               </div>
               <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-bioluminescence text-xs">#</div>
                  <span className="text-sm font-mono tracking-widest uppercase">Engineering HQ</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div id="architecture-inquiry-box" className="glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden" style={{ boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)' }}>
              <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] md:text-xs font-mono text-bioluminescence uppercase tracking-[0.2em] mb-2 font-bold opacity-80">Engineering Brief:</p>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  {t.followUpInfo}
                </p>
              </div>

              {step < questions.length ? (
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <span className="text-bioluminescence font-mono text-xs tracking-[0.3em] uppercase">
                       {t.step} {step + 1}
                    </span>
                    <div className="flex-1 h-[2px] bg-white/10 relative rounded-full">
                       <div 
                         className="absolute top-0 left-0 h-full bg-bioluminescence transition-all duration-700 shadow-[0_0_15px_#39FF14] rounded-full"
                         style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {questions[step].label}
                    </h3>
                    
                    {questions[step].type === 'select' ? (
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {questions[step].options?.map((opt) => (
                           <button
                             key={opt.value}
                             onClick={() => {
                               setAnswers({ ...answers, [step]: opt.label });
                               handleNext();
                             }}
                             className={`px-6 py-4 rounded-2xl text-left transition-all duration-300 border font-mono text-xs tracking-wider uppercase ${
                               answers[step] === opt.label 
                               ? 'bg-bioluminescence/20 border-bioluminescence text-white shadow-[0_0_20px_rgba(57,255,20,0.2)]' 
                               : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10'
                             }`}
                           >
                             {opt.label}
                           </button>
                        ))}
                      </div>
                    ) : step === 2 ? (
                      <div className="relative group space-y-4">
                         <textarea
                           className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[160px] text-lg text-white outline-none transition-all duration-500 placeholder-white/5 focus:border-bioluminescence resize-none font-light leading-relaxed"
                           placeholder={questions[step].placeholder}
                           value={answers[step] || ''}
                           onChange={e => setAnswers({ ...answers, [step]: e.target.value })}
                         />
                         
                         {/* File Drop Zone */}
                         <div 
                           onClick={() => fileInputRef.current?.click()}
                           onDragOver={onDragOver}
                           onDragLeave={onDragLeave}
                           onDrop={onDrop}
                           className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer group/file ${
                             isDragging ? 'bg-bioluminescence/20 border-bioluminescence scale-[1.02]' :
                             file ? 'bg-bioluminescence/10 border-bioluminescence' : 'bg-white/5 border-white/10 hover:border-bioluminescence/50 hover:bg-white/10'
                           }`}
                         >
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                              accept=".doc,.docx,.pdf,.txt"
                            />
                            <div className="flex flex-col items-center gap-3">
                               <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                                 file ? 'bg-bioluminescence border-bioluminescence text-black' : 'border-white/10 text-bioluminescence group-hover/file:border-bioluminescence/50'
                               }`}>
                                  {file ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                  ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                  )}
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                                    {file ? `${t.fileSelected} ${file.name}` : t.dropFiles}
                                  </p>
                                  {!file && <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Supports .DOC, .PDF, .TXT</p>}
                               </div>
                            </div>
                         </div>

                         <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-bioluminescence/60 uppercase tracking-widest">
                            <div className="animate-pulse">●</div>
                            <span>Deep Technical Discovery Active — Drop all technical requirements & project documentation here</span>
                         </div>
                      </div>
                    ) : (
                      <div className="relative group">
                         <input
                           type="text"
                           className="w-full bg-transparent border-b border-white/10 py-4 text-lg md:text-xl text-white outline-none transition-all duration-500 placeholder-white/5 focus:border-bioluminescence"
                           placeholder={questions[step].placeholder}
                           value={answers[step] || ''}
                           onChange={e => setAnswers({ ...answers, [step]: e.target.value })}
                           onKeyDown={e => e.key === 'Enter' && answers[step] && handleNext()}
                         />
                         <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-bioluminescence transition-all duration-500 group-focus-within:w-full shadow-[0_0_15px_#39FF14]" />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                       {questions[step].type === 'select' ? 'Select an option' : 'Press Enter to proceed'}
                    </p>
                    {questions[step].type !== 'select' && (
                      <button 
                        onClick={handleNext}
                        disabled={!answers[step]}
                        className="group flex items-center gap-4 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-20 bg-white text-black hover:bg-bioluminescence hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]"
                      >
                        {step === questions.length - 1 ? t.plantSeed : t.next}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-bioluminescence/10 border border-bioluminescence/20 flex items-center justify-center mx-auto mb-8">
                     <div className="w-4 h-4 rounded-full bg-bioluminescence animate-ping" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">{t.successTitle}</h3>
                  <p className="text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                    {t.successMessage}
                  </p>
                  <button 
                    onClick={() => { setStep(0); setAnswers({}); }}
                    className="mt-8 text-xs font-mono text-bioluminescence uppercase tracking-widest hover:underline"
                  >
                     Submit another inquiry
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
