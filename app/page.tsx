import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { About } from "@/components/About";
import { Contact, Footer } from "@/components/ContactFooter";
import { getProfile } from "@/lib/services/portfolio";
import { getProjects } from "@/lib/services/project";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getProfile();
  const projects = await getProjects();

  return (
    <div id="top" className="min-h-screen bg-background font-sans">
      <Navbar artistName={profile?.artistName} />
      <main>
        <Hero 
          artistName={profile?.artistName}
          title={profile?.title}
        />
        <ProjectGrid projects={projects as any} />
        <About 
          photo={profile?.aboutPhoto}
          description={profile?.aboutDescription}
          techniques={profile?.techniques}
          actionFields={profile?.actionFields}
          yearsOfExperience={profile?.yearsOfExperience}
        />
        <Contact />
      </main>
      <Footer 
        artistName={profile?.artistName} 
        socialLinks={profile?.socialLinks}
      />
    </div>
  );
}
