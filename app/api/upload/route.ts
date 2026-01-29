import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import sharp from "sharp";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/**
 * Gère le téléchargement d'images sur le serveur.
 * Vérifie l'authentification de l'administrateur, valide le fichier (type et taille),
 * optimise l'image via Sharp (conversion en WebP, redimensionnement) et gère la suppression
 * des anciennes images si nécessaire.
 * 
 * @param {NextRequest} req La requête HTTP contenant les données du formulaire (file, oldUrl).
 * @returns {Promise<NextResponse>} La réponse JSON contenant l'URL de l'image ou une erreur.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldUrl = formData.get("oldUrl") as string;
    const customFilename = formData.get("customFilename") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    /** Limite de taille fixée à 5 Mo */
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    /** Création d'un nom de fichier : soit un hash, soit un nom personnalisé */
    let filename: string;
    if (customFilename) {
      filename = `${customFilename}.webp`;
    } else {
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");
      filename = `${hash}.webp`;
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    /** S'assure que le répertoire de téléchargement existe et est accessible */
    try {
      if (!fs.existsSync(uploadDir)) {
        console.log(`Creating upload directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      // Test de permission d'écriture
      const testFile = path.join(uploadDir, ".write-test");
      fs.writeFileSync(testFile, "test");
      fs.unlinkSync(testFile);
    } catch (fsError) {
      console.error("Filesystem permission error in upload directory:", fsError);
      return NextResponse.json({ error: "Upload directory not writable" }, { status: 500 });
    }

    const filePath = path.join(uploadDir, filename);
    const url = `/uploads/${filename}`;

    /** Si le fichier n'existe pas encore ou si on utilise un nom personnalisé, on le traite et on l'enregistre */
    if (!fs.existsSync(filePath) || customFilename) {
      try {
        /** Traitement de l'image avec Sharp : redimensionnement et conversion en WebP */
        await sharp(buffer)
          .resize(1200, 1200, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toFile(filePath);
      } catch (sharpError) {
        console.error("Sharp processing error:", sharpError);
        throw sharpError;
      }
    }

    /** Suppression de l'ancienne image si elle est fournie et différente de la nouvelle */
    if (oldUrl && oldUrl.startsWith("/uploads/") && oldUrl !== url) {
      const oldFilename = oldUrl.split("/").pop();
      if (oldFilename) {
        const oldPath = path.join(uploadDir, oldFilename);
        try {
          if (fs.existsSync(oldPath)) {
            await unlink(oldPath);
          }
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
