"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroProps {
  artistName?: string;
  title?: string;
}

export function Hero({ artistName = "Digital", title = "Dimension." }: HeroProps) {
  return (
    <section className="pt-24 pb-12 md:pt-48 md:pb-32 overflow-hidden relative min-h-screen flex items-center">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 w-full">
        <div className="max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/20 leading-[0.9] uppercase">
              {artistName} <br /> {title}
            </h1>
          </motion.div>
          <motion.p 
            className="text-lg md:text-2xl text-white/60 mb-12 leading-relaxed max-w-2xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Sculpter le futur du design numérique à travers des expériences 3D immersives et des visuels de haute précision.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Button size="lg" className="rounded-full px-10 h-16 text-lg font-medium bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1" asChild>
              <Link href="#projects">Explorer l'œuvre</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-medium border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300" asChild>
              <Link href="#contact">Démarrer un projet</Link>
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vw] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-[15%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12" />
        <div className="absolute top-1/3 right-[20%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-white/10 to-transparent -rotate-45" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 w-1/2 h-full hidden xl:block"
      >
        <div className="relative w-full h-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
