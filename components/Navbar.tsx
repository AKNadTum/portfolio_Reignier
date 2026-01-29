"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface NavbarProps {
  artistName?: string;
}

export function Navbar({ artistName = "Reignier" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Ferme le menu mobile lors d'un clic sur un lien */
  const closeMenu = () => setIsOpen(false);

  /** Empêche le défilement de la page lorsque le menu mobile est ouvert */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1,
      } as const,
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      } as const,
    },
  };

  const itemVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-4 py-6 pointer-events-none"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between glass px-6 md:px-8 h-20 rounded-full pointer-events-auto relative">
          <Link href="/#top" className="text-xl md:text-2xl font-black tracking-tighter uppercase italic z-[60]" onClick={closeMenu}>
            {artistName}
          </Link>
          
          {/** Menu Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/#projects" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-all">
              Projets
            </Link>
            <Link href="/#about" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-all">
              Concept
            </Link>
            <Link href="/#contact" className="text-xs font-black uppercase tracking-widest hover:text-primary transition-all">
              Contact
            </Link>
            <Button variant="default" size="lg" asChild className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8">
              <Link href="/#contact">Hire Me</Link>
            </Button>
          </div>

          {/** Bouton Menu Mobile */}
          <button 
            className="md:hidden z-[70] p-2 text-white relative h-10 w-10 flex items-center justify-center focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
                className="absolute top-1/2 left-0 w-6 h-0.5 bg-white"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute top-1/2 left-0 w-6 h-0.5 bg-white"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
                className="absolute top-1/2 left-0 w-6 h-0.5 bg-white"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-950 border-l border-white/10 p-12 flex flex-col justify-center z-[65] md:hidden"
            >
              <div className="flex flex-col gap-12">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Navigation</span>
                  <div className="h-[1px] w-full bg-white/10" />
                </div>
                
                <nav className="flex flex-col gap-8">
                  {[
                    { href: "/#projects", label: "Projets" },
                    { href: "/#about", label: "Concept" },
                    { href: "/#contact", label: "Contact" },
                  ].map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link 
                        href={link.href} 
                        className="text-4xl font-black uppercase tracking-tighter hover:text-primary transition-all inline-block"
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div variants={itemVariants} className="pt-8">
                  <Button variant="default" size="lg" asChild className="w-full rounded-full bg-white text-black hover:bg-white/90 font-bold h-16 text-lg" onClick={closeMenu}>
                    <Link href="/#contact">Hire Me</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Bottom Decoration */}
              <div className="absolute bottom-12 left-12 right-12">
                <p className="text-xs text-white/20 font-medium tracking-widest uppercase">
                  © 2024 {artistName}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
