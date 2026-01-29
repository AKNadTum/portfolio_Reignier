"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile3dUrl, setProfile3dUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (data?.profile3dUrl) {
          setProfile3dUrl(data.profile3dUrl);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      content: formData.get("content") as string,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Une erreur est survenue.");
      }

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[100px] -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-primary/10 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-[8rem] font-black mb-8 md:mb-12 tracking-tighter uppercase italic leading-[0.8]">
            Let's create <br /><span className="text-white/20">The future.</span>
          </h2>
          <p className="text-lg md:text-2xl mb-12 md:mb-16 text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Votre projet mérite une dimension supérieure. Collaborons pour transformer vos idées en réalités numériques saisissantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full h-16 md:h-20 px-8 md:px-12 text-lg md:text-xl font-bold bg-white text-black hover:bg-white/90 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]">
                  Envoyer un message
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Contactez-moi</DialogTitle>
                  <DialogDescription className="text-white/50">
                    Remplissez le formulaire ci-dessous et je vous recontacterai dès que possible.
                  </DialogDescription>
                </DialogHeader>
                
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter">Message envoyé !</h3>
                      <p className="text-white/60">Merci pour votre intérêt. Je reviens vers vous très prochainement.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSuccess(false)}
                        className="mt-8 rounded-full border-white/10 hover:bg-white/5"
                      >
                        Envoyer un autre message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Nom</label>
                          <Input 
                            name="name" 
                            placeholder="Votre nom" 
                            required 
                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Email</label>
                          <Input 
                            name="email" 
                            type="email" 
                            placeholder="votre@email.com" 
                            required 
                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Message</label>
                        <Textarea 
                          name="content" 
                          placeholder="Parlez-moi de votre projet..." 
                          required 
                          className="min-h-[150px] rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all resize-none"
                        />
                      </div>
                      
                      {error && (
                        <p className="text-red-500 text-sm font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                          {error}
                        </p>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-lg transition-all"
                      >
                        {isPending ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  )}
                </AnimatePresence>
              </DialogContent>
            </Dialog>

            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full h-16 md:h-20 px-8 md:px-12 text-lg md:text-xl font-bold border-white/10 glass hover:bg-white/5 transition-all duration-500"
              asChild
            >
              <a href={profile3dUrl || "#"} target={profile3dUrl ? "_blank" : undefined} rel="noopener noreferrer">
                Voir mon profil 3D
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FooterProps {
  artistName?: string;
  socialLinks?: { platform: string; url: string }[];
}

export function Footer({ artistName = "Reignier", socialLinks = [] }: FooterProps) {
  return (
    <footer className="py-12 md:py-20 border-t border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Link href="#top" className="text-2xl font-black tracking-tighter uppercase italic">
            {artistName}<span className="text-primary">.3D</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center md:text-left">
                © 2026 <Link href="https://eternom.fr" target="_blank" className="hover:text-white transition-colors">Eternom Create</Link>. Tous droits réservés.
              </p>
            </div>
            <Link 
              href="/login" 
              className="text-white/5 hover:text-white/20 transition-all duration-300 text-[8px] font-bold uppercase tracking-[0.2em]"
            >
              Admin
            </Link>
          </div>
        </div>
        <div className="flex gap-6 md:gap-10 flex-wrap justify-center">
          {socialLinks.length > 0 ? socialLinks.map(social => (
            <a 
              key={social.platform} 
              href={social.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-all duration-300 text-[10px] md:text-xs font-black uppercase tracking-widest hover:translate-y-[-2px] block"
            >
              {social.platform}
            </a>
          )) : ["Instagram", "Behance", "LinkedIn", "Twitter"].map(social => (
            <a 
              key={social} 
              href="#" 
              className="text-white/40 hover:text-white transition-all duration-300 text-[10px] md:text-xs font-black uppercase tracking-widest hover:translate-y-[-2px] block"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
