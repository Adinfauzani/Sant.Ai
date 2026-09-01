"use client";

import { useRouter } from "next/navigation";
import {
  Kanban as KanbanIcon,
  List,
  MoreHorizontal,
  Settings,
  Trash,
  Share,
  Calendar,
  Plus,
  History,
} from "lucide-react";
import { Button } from "@santai/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@santai/ui/dialog";
import { Input } from "@santai/ui/input";
import { Label } from "@santai/ui/label";
import { Separator } from "@santai/ui/separator";
import { SidebarTrigger } from "@santai/ui/sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { deleteBoard, updateBoard } from "@/lib/board-actions";

interface BoardHeaderProps {
  board?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    visibility: string;
    ownerId: string;
    owner: { id: string; name: string; image: string | null };
    _count: { tasks: number };
  };
  currentView: "kanban" | "list";
  onViewChange: (view: "kanban" | "list") => void;
  isOwner: boolean;
  boardId?: string;
  showSidebarTrigger?: boolean;
}

export function BoardHeader({ board, currentView, onViewChange, isOwner, boardId, showSidebarTrigger }: BoardHeaderProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [name, setName] = useState(board?.name ?? "");
  const [description, setDescription] = useState(board?.description ?? "");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!board?.id) return;
    setDeleting(true);
    try {
      await deleteBoard(board.id);
      router.push("/dashboard/boards");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!board?.id) return;
    await updateBoard(board.id, { name, description });
    setShowSettings(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
          )}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <KanbanIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">{board?.name ?? "Board"}</h1>
            {board && (
              <p className="text-[10px] text-muted">
                {board._count.tasks} tasks &middot; {board.visibility}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              onClick={() => onViewChange("kanban")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                currentView === "kanban"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              <KanbanIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange("list")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                currentView === "list"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              disabled
              className="rounded-md p-1.5 text-muted opacity-40 cursor-not-allowed"
            >
              <Calendar className="h-4 w-4" />
            </button>
            <button
              disabled
              className="rounded-md p-1.5 text-muted opacity-40 cursor-not-allowed"
            >
              <History className="h-4 w-4" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Board Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDelete(true)}
                    className="text-red-500"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Board
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem disabled>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board Settings</DialogTitle>
            <DialogDescription>Update your board details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{board?.name}&rdquo; and all its tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
