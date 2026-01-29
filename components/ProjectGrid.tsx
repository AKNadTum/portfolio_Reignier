"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Project, Tag } from "@/prisma/generated";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ProjectWithTags = Project & {
  tags: Tag[];
};

interface ProjectGridProps {
  projects: ProjectWithTags[];
}

export function ProjectGrid({ projects = [] }: ProjectGridProps) {
  const [filter, setFilter] = useState<string>("All");

  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
    const sorted = [...categories].sort((a, b) => a.localeCompare(b));
    return ["All", ...sorted.slice(0, 5)];
  }, [projects]);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-16 md:py-32 relative">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter uppercase italic">Portfolio</h2>
            <p className="text-lg md:text-xl text-white/50 max-w-lg">
              Une immersion dans mes explorations visuelles les plus récentes.
            </p>
          </div>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            {filterOptions.map((opt) => (
              <Button
                key={`filter-${opt}`}
                variant={filter === opt ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-6 md:px-10 md:h-12 md:text-base transition-all duration-300 ${filter === opt ? "scale-105 md:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "opacity-50 hover:opacity-100"}`}
                onClick={() => setFilter(opt)}
              >
                {opt === "All" ? "Tous" : opt}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 transition-all duration-500 hover:border-white/20 shadow-xl group-hover:shadow-2xl group-hover:shadow-white/5">
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={project.image && project.image.trim() !== "" ? project.image : "/images/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized={!project.image || project.image.trim() === "" || project.image.startsWith("/uploads/")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="glass backdrop-blur-md bg-white/10 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold border-none text-white">
                          {project.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {project.tags && project.tags.slice(0, 3).map((tag: any, idx: number) => {
                            const tagName = typeof tag === 'object' ? tag.name : tag;
                            const tagId = typeof tag === 'object' ? tag.id : `tag-${idx}`;
                            return (
                              <span 
                                key={tagId} 
                                className="text-[9px] font-medium uppercase tracking-wider text-white/70 bg-white/10 px-2 py-0.5 rounded-full border border-white/10"
                              >
                                {tagName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
