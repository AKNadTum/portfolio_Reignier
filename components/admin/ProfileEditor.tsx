"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import Image from "next/image";
import { X, Plus, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const profileSchema = z.object({
  artistName: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
  yearsOfExperience: z.number().min(0, "Les années d'expérience doivent être un nombre positif"),
  aboutDescription: z.string().optional(),
  aboutPhoto: z.string().optional(),
  profile3dUrl: z.string().url("Veuillez entrer une URL valide").or(z.literal("")).optional(),
});

interface ProfileEditorProps {
  initialData: any;
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [aboutPhoto, setAboutPhoto] = useState(initialData?.aboutPhoto || "");
  const [techniques, setTechniques] = useState<{ name: string }[]>(initialData?.techniques || []);
  const [actionFields, setActionFields] = useState<{ name: string }[]>(initialData?.actionFields || []);
  const [socialLinks, setSocialLinks] = useState<{ platform: string, url: string }[]>(initialData?.socialLinks || []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      artistName: initialData?.artistName || "",
      title: initialData?.title || "",
      yearsOfExperience: initialData?.yearsOfExperience || 0,
      aboutDescription: initialData?.aboutDescription || "",
      aboutPhoto: initialData?.aboutPhoto || "",
      profile3dUrl: initialData?.profile3dUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          aboutPhoto,
          techniques,
          actionFields,
          socialLinks,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  const addTechnique = () => setTechniques([...techniques, { name: "" }]);
  const removeTechnique = (index: number) => setTechniques(techniques.filter((_, i) => i !== index));
  const updateTechnique = (index: number, name: string) => {
    const newTechs = [...techniques];
    newTechs[index].name = name;
    setTechniques(newTechs);
  };

  const addActionField = () => setActionFields([...actionFields, { name: "" }]);
  const removeActionField = (index: number) => setActionFields(actionFields.filter((_, i) => i !== index));
  const updateActionField = (index: number, name: string) => {
    const newFields = [...actionFields];
    newFields[index].name = name;
    setActionFields(newFields);
  };

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  const removeSocialLink = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index));
  const updateSocialLink = (index: number, platform: string, url: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { platform, url };
    setSocialLinks(newLinks);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="uppercase tracking-tighter text-2xl font-black italic">Informations Générales</CardTitle>
            <CardDescription className="text-zinc-500">Configurez votre nom d'artiste et le titre de votre portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="artistName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Nom de l'artiste</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} className="bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-white transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Expérience (ans)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-white transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Titre Professionnel</FormLabel>
                        <FormControl>
                          <Input placeholder="ex: Artiste 3D & Motion Designer" {...field} className="bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-white transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profile3dUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Lien Profil 3D</FormLabel>
                        <FormControl>
                          <Input placeholder="https://sketchfab.com/votre-profil" {...field} className="bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-white transition-all" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="aboutDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">À propos (Description)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre parcours..." 
                          className="min-h-[150px] bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-white transition-all resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 font-bold uppercase text-xs tracking-[0.2em] py-6">
                  {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="uppercase tracking-tighter text-2xl font-black italic">Réseaux Sociaux</CardTitle>
            <CardDescription className="text-zinc-500">Gérez vos liens vers vos profils externes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-end animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex-1 space-y-2">
                  <label className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Plateforme</label>
                  <Input 
                    value={link.platform} 
                    onChange={(e) => updateSocialLink(index, e.target.value, link.url)}
                    placeholder="ex: Instagram"
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="flex-[2] space-y-2">
                  <label className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">URL</label>
                  <Input 
                    value={link.url} 
                    onChange={(e) => updateSocialLink(index, link.platform, e.target.value)}
                    placeholder="https://..."
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <Button variant="destructive" size="icon" onClick={() => removeSocialLink(index)} className="shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSocialLink} className="w-full border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:border-white transition-all">
              <Plus className="w-4 h-4 mr-2" /> Ajouter un lien
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="uppercase tracking-tighter text-2xl font-black italic">Photo de Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-square w-full max-w-[300px] mx-auto group">
              {aboutPhoto && aboutPhoto.trim() !== "" ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-zinc-800 group-hover:border-white transition-colors">
                  <Image src={aboutPhoto} alt="Profile" fill className="object-cover" />
                  <button 
                    onClick={() => setAboutPhoto("")}
                    className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-600">
                   <p className="text-xs uppercase font-bold tracking-widest">Aucune photo</p>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <ImageUpload
                onUploadComplete={(url) => setAboutPhoto(url)}
                oldUrl={aboutPhoto}
                customFilename={session?.user?.id ? `profile-${session.user.id}` : undefined}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="uppercase tracking-tighter text-2xl font-black italic">Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {techniques.map((tech, index) => (
                  <div key={index} className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-1 py-1 group hover:border-white transition-colors">
                    <input 
                      value={tech.name}
                      onChange={(e) => updateTechnique(index, e.target.value)}
                      className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-wider w-24"
                      placeholder="Technique..."
                    />
                    <button onClick={() => removeTechnique(index)} className="p-1 text-zinc-600 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addTechnique} className="rounded-full border-dashed border-zinc-800 text-zinc-500">
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="uppercase tracking-tighter text-2xl font-black italic">Champs d'Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {actionFields.map((field, index) => (
                  <div key={index} className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-1 py-1 group hover:border-white transition-colors">
                    <input 
                      value={field.name}
                      onChange={(e) => updateActionField(index, e.target.value)}
                      className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-wider w-32"
                      placeholder="Domaine..."
                    />
                    <button onClick={() => removeActionField(index)} className="p-1 text-zinc-600 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addActionField} className="rounded-full border-dashed border-zinc-800 text-zinc-500">
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
