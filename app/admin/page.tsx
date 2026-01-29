import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/lib/services/portfolio";
import { getProjects } from "@/lib/services/project";
import { getMessages } from "@/lib/services/messages";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { MessageManager } from "@/components/admin/MessageManager";
import { AccountSettings } from "@/components/admin/AccountSettings";
import { LogoutButton } from "@/components/admin/LogoutButton";
import Link from "next/link";
import { ArrowLeft, User, LayoutGrid, Settings, Mail } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const messages = await getMessages();

  return (
    <div className="container mx-auto py-10 px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <Link href="/" className="flex items-center text-sm text-zinc-500 hover:text-white mb-2 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au site
          </Link>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Dashboard Admin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LogoutButton />
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-10">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 uppercase text-xs font-bold tracking-widest px-8 rounded-lg py-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-zinc-800 uppercase text-xs font-bold tracking-widest px-8 rounded-lg py-3 flex items-center">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-zinc-800 uppercase text-xs font-bold tracking-widest px-8 rounded-lg py-3 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-800 uppercase text-xs font-bold tracking-widest px-8 rounded-lg py-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="animate-in fade-in duration-500">
          <ProfileEditor initialData={profile as any} />
        </TabsContent>
        
        <TabsContent value="projects" className="animate-in fade-in duration-500">
          <ProjectManager initialProjects={projects as any} />
        </TabsContent>

        <TabsContent value="messages" className="animate-in fade-in duration-500">
          <MessageManager initialMessages={messages as any} />
        </TabsContent>

        <TabsContent value="settings" className="max-w-2xl mx-auto animate-in fade-in duration-500">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
