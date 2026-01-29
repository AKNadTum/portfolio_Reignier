"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/ContactFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag as TagIcon, Layout } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectClientProps {
  project: any;
  profile: any;
}

export default function ProjectClient({ project, profile }: ProjectClientProps) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar artistName={profile?.artistName} />
      
      <main className="pt-32 pb-20">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/#projects" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group"
            >
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold uppercase tracking-widest">Retour au portfolio</span>
            </Link>
          </motion.div>

          {/* Project Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6 glass border-none px-4 py-1 text-xs uppercase tracking-[0.2em] font-bold text-white">
                {project.category}
              </Badge>
              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6">
                {project.title}
              </h1>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-3 pb-2"
            >
              {project.tags.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="text-xs font-black uppercase tracking-[0.2em] text-white/40 border border-white/10 px-4 py-2 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Featured Image */}
          {project.image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/9] md:aspect-[21/9] w-full mb-20 overflow-hidden rounded-[2rem] shadow-2xl border border-white/5"
            >
              <Image 
                src={project.image} 
                alt={project.title} 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          )}

          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8"
            >
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 text-white/20">À propos du projet</h2>
              <div 
                className="prose prose-invert prose-2xl max-w-none text-white/80 leading-relaxed font-light"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {project.content}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 space-y-12"
            >
              <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-primary">Détails techniques</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-white/40">
                      <Layout size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Catégorie</p>
                      <p className="font-bold text-white uppercase">{project.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-white/40">
                      <TagIcon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Expertise</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.tags.map((tag: any) => (
                          <span key={tag.id} className="text-[10px] font-bold text-white/60 bg-white/5 px-2 py-1 rounded">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/5 text-white/40">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Date</p>
                      <p className="font-bold text-white uppercase">
                        {new Date(project.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-10 rounded-2xl h-14 font-bold uppercase tracking-widest text-xs bg-white text-black hover:bg-white/90">
                  Partager le projet
                </Button>
              </div>

              <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                <h3 className="text-lg font-bold mb-4 italic">Prêt à donner vie à vos idées ?</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  Chaque projet est une nouvelle aventure. Discutons de la vôtre dès maintenant.
                </p>
                <Link href="/#contact">
                  <Button variant="outline" className="w-full rounded-2xl h-14 border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                    Démarrer un projet
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer 
        artistName={profile?.artistName} 
        socialLinks={profile?.socialLinks}
      />
    </div>
  );
}
