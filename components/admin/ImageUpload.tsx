"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  oldUrl?: string;
  className?: string;
  customFilename?: string;
}

export function ImageUpload({ onUploadComplete, oldUrl, className, customFilename }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (oldUrl) {
      formData.append("oldUrl", oldUrl);
    }
    if (customFilename) {
      formData.append("customFilename", customFilename);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      onUploadComplete(data.url);
      toast.success("Image téléchargée !");
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <Button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase tracking-widest h-10 px-4"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Téléchargement...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Choisir une image
          </>
        )}
      </Button>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
        Images (Max 5Mo)
      </p>
    </div>
  );
}
