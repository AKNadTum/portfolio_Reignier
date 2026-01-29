"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <Button 
      variant="outline" 
      className="border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Déconnexion
    </Button>
  );
}
