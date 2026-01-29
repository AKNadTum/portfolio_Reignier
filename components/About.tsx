"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutProps {
  photo?: string | null;
  description?: string | null;
  techniques?: { name: string }[];
  actionFields?: { name: string }[];
  yearsOfExperience?: number;
}

export function About({ 
  photo, 
  description, 
  techniques = [], 
  actionFields = [],
  yearsOfExperience = 0
}: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-48 overflow-hidden relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] lg:col-span-5 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 rounded-[2rem] md:rounded-[3rem] rotate-3 scale-105 opacity-20 group-hover:rotate-6 transition-transform duration-700" />
            <div className="relative h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
              <Image
                src={photo && photo.trim() !== "" ? photo : "/images/profile.jpg"}
                alt="Portrait de l'artiste"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                unoptimized={!photo || photo.trim() === "" || photo.startsWith("/uploads/")}
              />
            </div>
            
            {/* Stats floating cards */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 md:-right-8 bottom-8 md:bottom-12 glass p-4 md:p-6 rounded-2xl hidden sm:block"
            >
              <p className="text-2xl md:text-3xl font-black italic">{yearsOfExperience}+</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/50">Années d'Exp.</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.9]">
              L'approche <br /> <span className="text-white/20">Créative.</span>
            </h2>
            <div className="space-y-6 md:space-y-8 max-w-2xl text-white/70 leading-relaxed font-light text-xl md:text-2xl">
              {description ? (
                <div className="whitespace-pre-wrap">{description}</div>
              ) : (
                <>
                  <p>
                    Chaque pixel est une opportunité de raconter une histoire unique. Mon approche fusionne la <span className="text-white font-medium">précision mathématique</span> et l'instinct artistique.
                  </p>
                  <p className="text-lg md:text-xl text-white/50">
                    Spécialisé dans la création de mondes numériques qui semblent tangibles, je repousse les limites de ce qui est possible en 3D pour offrir des expériences visuelles inoubliables.
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-16">
              <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Arsenal Technique</h4>
                <div className="flex flex-wrap gap-3">
                  {(techniques.length > 0 ? techniques : [{ name: "Blender" }, { name: "Cinema 4D" }, { name: "Houdini" }, { name: "Octane" }, { name: "ZBrush" }, { name: "After Effects" }]).map(tool => (
                    <span key={tool.name} className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">{tool.name}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Champs d'Action</h4>
                <ul className="grid grid-cols-1 gap-3">
                  {(actionFields.length > 0 ? actionFields : [{ name: "Animation Immersive" }, { name: "Design Produit High-End" }, { name: "Identité Visuelle 3D" }, { name: "Environnements Virtuels" }]).map(item => (
                    <li key={item.name} className="flex items-center gap-3 text-sm font-medium text-white/60">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
