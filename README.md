# Portfolio de Reignier

Bienvenue dans le dépôt du portfolio de Reignier. Ce projet est une application web moderne conçue pour présenter les travaux d'un artiste, ses compétences techniques et son expérience professionnelle, avec un accent particulier sur le domaine de l'animation et de la création 3D.

## 🚀 Technologies utilisées

Le projet repose sur une stack technologique moderne et performante :

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion 12](https://www.framer.com/motion/) (animations), [Lucide React](https://lucide.dev/) (icônes)
- **Composants UI** : [Radix UI](https://www.radix-ui.com/) (via shadcn/ui)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/) avec [Prisma 7](https://www.prisma.io/)
- **Authentification** : [Better Auth 1.4](https://www.better-auth.com/)
- **Gestion de formulaires** : [React Hook Form 7](https://react-hook-form.com/) avec validation [Zod 4](https://zod.dev/)

## ✨ Fonctionnalités

- **Galerie de Projets** : Présentation élégante des projets avec filtrage par catégorie et tags.
- **Section À Propos** : Mise en avant du parcours, des techniques maîtrisées (Blender, Houdini, etc.) et des champs d'action.
- **Formulaire de Contact** : Permet aux visiteurs d'envoyer des messages directement depuis le site, stockés en base de données.
- **Espace Administration** : Gestion sécurisée des projets, du profil et consultation des messages reçus.
- **Design Responsive** : Expérience utilisateur optimisée pour tous les types d'écrans.

## 🛠️ Installation et configuration

### Prérequis

- Node.js (version 20 ou supérieure)
- Une instance de base de données PostgreSQL

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd portfolio_reignier
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet :
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   BETTER_AUTH_SECRET="votre_secret_genere"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   
   # Peupler la base de données avec des données initiales (Admin, Profil, Projets)
   npx prisma db seed
   ```
   *Note : L'identifiant par défaut après le seed est `admin@portfolio.com` avec le mot de passe `password123`.*

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## 🐳 Docker

Le projet inclut une configuration Docker pour simplifier le déploiement local ou en production :

- **Lancer avec Docker Compose** :
  ```bash
  docker compose up --build
  ```
  L'application sera accessible sur [http://localhost:3454](http://localhost:3454).

## 📝 Scripts principaux

- `npm run dev` : Lance l'environnement de développement.
- `npm run build` : Prépare l'application pour la production.
- `npm run start` : Lance l'application en mode production.
- `npm run lint` : Analyse le code pour détecter d'éventuelles erreurs.

---
Développé pour Reignier.
