/**
 * Interface représentant un projet dans le portfolio.
 */
export interface Project {
  id: string;
  title: string;
  category: "Animation" | "Brand" | "Product";
  description: string;
  imageUrl: string;
  tags: string[];
}

/**
 * Liste de projets exemples utilisés pour le développement et les tests.
 */
export const projects: Project[] = [
  {
    id: "1",
    title: "Cosmic Flow",
    category: "Animation",
    description: "Une exploration abstraite du mouvement fluide dans l'espace, utilisant des simulations de particules complexes.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    tags: ["Blender", "Particles", "Simulation"],
  },
  {
    id: "2",
    title: "EcoWatch Concept",
    category: "Product",
    description: "Rendu produit haute fidélité d'une montre intelligente écologique, mettant en avant les matériaux durables.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    tags: ["Hard Surface", "Texturing", "Lighting"],
  },
  {
    id: "3",
    title: "Nebula Identity",
    category: "Brand",
    description: "Identité visuelle 3D pour une marque de technologie, incluant des logos animés et des assets marketing.",
    imageUrl: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    tags: ["Branding", "Logo Design", "Abstract"],
  },
  {
    id: "4",
    title: "HyperLoop Transport",
    category: "Animation",
    description: "Visualisation futuriste d'un système de transport à grande vitesse dans un environnement urbain.",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop",
    tags: ["Environment", "Animation", "Future"],
  },
  {
    id: "5",
    title: "Lumina Furniture",
    category: "Product",
    description: "Série de rendus pour une collection de mobilier design, accentuant l'interaction entre la lumière et les textures.",
    imageUrl: "https://images.unsplash.com/photo-1538688598135-d2923e78f99a?q=80&w=1000&auto=format&fit=crop",
    tags: ["Interior", "Product Design", "Octane"],
  },
  {
    id: "6",
    title: "Stellar Beverage",
    category: "Brand",
    description: "Campagne publicitaire 3D pour une boisson énergisante, mettant l'accent sur la fraîcheur et le dynamisme.",
    imageUrl: "https://images.unsplash.com/photo-1527960669566-f882ba85a4c6?q=80&w=1000&auto=format&fit=crop",
    tags: ["Liquid", "Simulation", "Advertising"],
  },
];
