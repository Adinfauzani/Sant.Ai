"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Kanban as KanbanIcon,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@santai/ui/dialog";
import { Label } from "@santai/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@santai/ui/select";
import { createBoard } from "@/lib/board-actions";

interface Board {
  id: string;
  name: string;
  description: string;
  icon: string;
  visibility: string;
  createdAt: Date;
  _count: { tasks: number; members: number };
  owner: { id: string; name: string; image: string | null };
  columns: { id: string; name: string }[];
}

export function BoardList({ boards: initial }: { boards: Board[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = initial.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const board = await createBoard({ name, description, visibility: visibility as any });
      setOpen(false);
      setName("");
      setDescription("");
      setVisibility("Private");
      router.push(`/dashboard/boards/${board.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-sm text-muted">Organize your projects, tasks, and research</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Board
        </Button>
      </div>

      <div className="border-b border-border px-6 py-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search boards..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <KanbanIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">No boards found</h3>
            <p className="mb-4 text-sm text-muted">
              {search ? "Try a different search term" : "Create your first board to get started"}
            </p>
            {!search && (
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((board) => (
              <button
                key={board.id}
                onClick={() => router.push(`/dashboard/boards/${board.id}`)}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <KanbanIcon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold group-hover:text-primary transition-colors">
                  {board.name}
                </h3>
                {board.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted">{board.description}</p>
                )}
                <div className="mt-auto flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {board._count.tasks} tasks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {board._count.members}
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider">
                    {board.visibility}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
            <DialogDescription>
              A board helps you organize projects, tasks, and research.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. AI Research Lab"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description (optional)</Label>
              <Input
                id="desc"
                placeholder="What is this board about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                  <SelectItem value="Public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || creating}>
              {creating ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
