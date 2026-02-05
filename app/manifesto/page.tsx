"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function Manifesto() {
  const { scrollYProgress } = useScroll();
  
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-brand-neon selection:text-black">
      
      {/* SECTION 1 */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504701954957-2032ff956c81?q=80&w=2070')] bg-cover bg-center opacity-30 grayscale contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        
        <div className="relative z-10 text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-brand-neon font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4">
                /// Philosophy
            </motion.p>
            {/* SCALED FONT SIZE FOR MOBILE */}
            <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: "circOut" }} className="text-[15vw] md:text-[12vw] leading-[0.8] font-black uppercase italic tracking-tighter mix-blend-difference">
                Chaos Is<br />Luxury
            </motion.h1>
        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
            <span className="text-[10px] uppercase tracking-widest">Scroll to Decrypt</span>
            <ArrowDown size={14} className="animate-bounce" />
        </motion.div>
      </section>

      {/* SECTION 2 */}
      <section className="py-20 md:py-32 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-5xl font-bold leading-tight uppercase mb-8 md:mb-12 text-white/90">
                The world is changing. <br />
                <span className="text-white/40">Adaptation is the only currency.</span>
            </h2>
            <div className="text-base md:text-xl font-mono text-white/60 space-y-6 md:space-y-8 leading-relaxed max-w-3xl mx-auto text-left md:text-center border-l-2 md:border-l-0 border-brand-neon pl-4 md:pl-0">
                <p>
                    We do not design for the runway. We design for the wasteland. 
                    For the concrete jungle. For the noise and the signal.
                </p>
                <p>
                    Cactus Bear is not a clothing brand. It is a survival kit for the digital age. 
                    Heavyweight fabrics. Tactical utility. Unapologetic aesthetic.
                </p>
                <p>
                   We stand at the intersection of <span className="text-brand-neon">brutalist architecture</span> and <span className="text-brand-neon">high-end street culture</span>.
                </p>
            </div>
          </motion.div>
      </section>

      {/* SECTION 3 */}
      <section className="py-12 md:py-20 overflow-hidden border-y border-white/10 bg-[#050505]">
         <motion.div style={{ x: x1 }} className="whitespace-nowrap mb-4">
            <h3 className="text-[12vw] md:text-[10vw] font-black uppercase italic text-transparent leading-none opacity-80" style={{ WebkitTextStroke: '1px #ccff00' }}>
                Resilience /// Strength /// Armor ///
            </h3>
         </motion.div>
         <motion.div style={{ x: x2 }} className="whitespace-nowrap">
            <h3 className="text-[12vw] md:text-[10vw] font-black uppercase italic text-white leading-none">
                No Compromise /// Visual Noise ///
            </h3>
         </motion.div>
      </section>

      {/* SECTION 4 */}
      <section className="h-[60vh] md:h-[80vh] flex flex-col items-center justify-center relative px-4">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=2000')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-8xl font-black uppercase italic mb-8">Join The <br />Resistance</h2>
              <Link href="/collections" className="bg-brand-neon text-black px-8 md:px-12 py-4 md:py-5 font-black uppercase tracking-widest text-sm md:text-xl hover:bg-white hover:scale-105 transition-all">
                  Secure Your Gear
              </Link>
          </div>
      </section>

    </div>
  );
}