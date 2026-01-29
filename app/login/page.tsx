"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        });

        if (error) {
            setError(error.message || "Une erreur est survenue lors de la connexion.");
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[100px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -z-10" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full glass p-10 rounded-[2rem] border border-white/10 text-center"
            >
                <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic mb-8 block">
                    Reignier<span className="text-primary">.3D</span>
                </Link>
                
                <h1 className="text-2xl font-bold mb-2">Connexion Admin</h1>
                <p className="text-white/50 mb-8 font-light italic">Entrez vos identifiants pour accéder au dashboard.</p>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email</label>
                        <Input 
                            type="email" 
                            placeholder="votre@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-black/20 border-white/5 focus:border-white/20 transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Mot de passe</label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-black/20 border-white/5 focus:border-white/20 transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs mt-2 text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20 italic">
                            {error}
                        </p>
                    )}
                    
                    <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all mt-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                </form>
                
                <div className="mt-10">
                    <Link href="/" className="text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-black italic">
                        Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
