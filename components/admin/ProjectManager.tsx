"use client";

import { useState, useEffect } from "react";
import { Project, Tag } from "@/prisma/generated";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projectSchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  category: z.string().min(2, "La catégorie est requise"),
  content: z.string().min(10, "Le contenu est requis"),
  image: z.string().optional(),
  /** On gère la conversion en tableau de chaînes de caractères lors de la soumission du formulaire */
  tags: z.string().optional(),
});

type ProjectWithTags = Project & {
  tags: Tag[];
};

interface ProjectManagerProps {
  initialProjects: ProjectWithTags[];
}

export function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectWithTags[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithTags | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      const fetchTags = async () => {
        try {
          const response = await fetch("/api/tags");
          const data = await response.json();
          setAvailableTags(data);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };
      fetchTags();
    }
  }, [isDialogOpen]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "Animation",
      content: "",
      image: "",
      tags: "",
    },
  });

  const openAddDialog = () => {
    setEditingProject(null);
    setImageUrl("");
    form.reset({
      title: "",
      slug: "",
      category: "Animation",
      content: "",
      image: "",
      tags: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: ProjectWithTags) => {
    setEditingProject(project);
    setImageUrl(project.image || "");
    form.reset({
      title: project.title,
      slug: project.slug,
      category: project.category,
      content: project.content,
      image: project.image || "",
      tags: project.tags.map(t => t.name).join(", "),
    });
    setIsDialogOpen(true);
  };

  const addTag = (tagName: string) => {
    const currentTags = form.getValues("tags") || "";
    const tagArray = currentTags.split(",").map(t => t.trim()).filter(t => t !== "");
    if (!tagArray.includes(tagName)) {
      form.setValue("tags", tagArray.length > 0 ? `${tagArray.join(", ")}, ${tagName}` : tagName);
    }
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setLoading(true);
    const tagArray = values.tags ? values.tags.split(",").map(t => t.trim()).filter(t => t !== "") : [];
    
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          image: imageUrl,
          tags: tagArray,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      const savedProject = await response.json();
      
      if (editingProject) {
        setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
        toast.success("Projet mis à jour !");
      } else {
        setProjects([savedProject, ...projects]);
        toast.success("Projet créé !");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      
      setProjects(projects.filter(p => p.id !== id));
      toast.success("Projet supprimé !");
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Gestion des Projets</h2>
        <Button onClick={openAddDialog} className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" /> Nouveau Projet
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Image</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Titre</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Catégorie</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500">Slug</TableHead>
              <TableHead className="uppercase text-[10px] font-black tracking-[0.2em] text-zinc-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500 italic">Aucun projet trouvé.</TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell>
                    <div className="relative w-16 h-10 rounded overflow-hidden bg-black">
                      {project.image && project.image.trim() !== "" ? (
                        <Image 
                          src={project.image} 
                          alt={project.title} 
                          fill 
                          className="object-cover" 
                          unoptimized={project.image.startsWith("/uploads/")}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[8px] text-zinc-700">NO IMG</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{project.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] uppercase font-bold tracking-widest">{project.category}</span>
                  </TableCell>
                  <TableCell className="text-zinc-500 font-mono text-xs">{project.slug}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => onDelete(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-tighter text-2xl">
              {editingProject ? "Modifier le projet" : "Nouveau projet"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Remplissez les informations ci-dessous pour {editingProject ? "mettre à jour" : "créer"} un projet.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Titre</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black border-zinc-800" onChange={(e) => {
                          field.onChange(e);
                          if (!editingProject) {
                            form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
                          }
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Slug</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black border-zinc-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Catégorie</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-black border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Contenu (Description)</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-black border-zinc-800 min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Tags (séparés par des virgules)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Blender, 3D, Animation" className="bg-black border-zinc-800" />
                    </FormControl>
                    {availableTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availableTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(tag.name)}
                            className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition-colors"
                          >
                            + {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="uppercase text-[10px] font-bold tracking-[0.2em] text-zinc-500">Image du projet</FormLabel>
                <div className="flex items-start gap-4">
                  {imageUrl && imageUrl.trim() !== "" && (
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-zinc-800">
                      <Image 
                        src={imageUrl} 
                        alt="Project Preview" 
                        fill 
                        className="object-cover" 
                        unoptimized={imageUrl.startsWith("/uploads/")}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <ImageUpload
                      onUploadComplete={(url) => setImageUrl(url)}
                      oldUrl={imageUrl}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="uppercase text-xs font-bold tracking-widest">Annuler</Button>
                <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8">
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
