"use client";

import { useState } from "react";
import { Message } from "@/prisma/generated";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Eye, Mail, Calendar, User } from "lucide-react";

interface MessageManagerProps {
  initialMessages: Message[];
}

export function MessageManager({ initialMessages }: MessageManagerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setMessages(messages.filter((m) => m.id !== id));
      toast.success("Message supprimé avec succès");
    } catch (error) {
      toast.error("Impossible de supprimer le message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Messages</h2>
        <span className="text-zinc-500 text-sm">
          {messages.length} message(s) reçu(s)
        </span>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest py-4">Date</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest py-4">Expéditeur</TableHead>
              <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest py-4">Sujet</TableHead>
              <TableHead className="text-right text-zinc-400 font-bold uppercase text-[10px] tracking-widest py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-zinc-500">
                  Aucun message reçu pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors group">
                  <TableCell className="text-zinc-400 text-sm">
                    {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{message.name}</span>
                      <span className="text-zinc-500 text-xs">{message.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300 max-w-[300px] truncate">
                    {message.subject}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                              Détails du message
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500">
                              Reçu le {message.createdAt && new Date(message.createdAt).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                                  <User className="w-3 h-3 mr-1" /> Expéditeur
                                </span>
                                <p className="text-white font-medium">{message.name}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" /> Email
                                </span>
                                <p className="text-white font-medium">{message.email}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sujet</span>
                              <p className="text-white font-medium">{message.subject}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Message</span>
                              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-950/50 text-red-500 border border-red-900/50 hover:bg-red-900 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest"
                              onClick={() => {
                                handleDelete(message.id);
                                // Note: Dialog will stay open unless we manually close it or it's unmounted
                              }}
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer ce message
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(message.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
