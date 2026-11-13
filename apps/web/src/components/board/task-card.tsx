"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  MessageSquare,
  Paperclip,
  Calendar,
  CheckSquare,
  MoreHorizontal,
  Trash,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@santai/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import { Button } from "@santai/ui/button";

interface TaskCardData {
  id: string;
  title: string;
  priority: string;
  dueDate: string | null;
  coverImage: string | null;
  order: number;
  assignees: { user: { id: string; name: string; image: string | null } }[];
  labels: { label: { id: string; name: string; color: string } }[];
  _count: { comments: number; attachments: number };
}

interface TaskCardProps {
  task: TaskCardData;
  onEdit: (task: TaskCardData) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors: Record<string, string> = {
  Urgent: "bg-destructive",
  High: "bg-warning",
  Medium: "bg-primary",
  Low: "bg-border-strong",
};

const priorityLabelColors: Record<string, string> = {
  Urgent: "border-destructive/30 bg-destructive/10 text-destructive",
  High: "border-warning/30 bg-warning/10 text-warning",
  Medium: "border-primary/30 bg-primary/10 text-primary",
  Low: "border-border bg-surface text-muted",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasMeta = task._count.comments > 0 || task._count.attachments > 0 || task.dueDate;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-3 transition-colors duration-150",
        "hover:border-border-strong",
        isDragging && "shadow-lg ring-2 ring-primary/20 scale-[1.02] z-50"
      )}
    >
      {/* Cover */}
      {task.coverImage && (
        <div className="-mx-3 -mt-3 mb-3 overflow-hidden rounded-t-xl">
          <img
            src={task.coverImage}
            alt=""
            className="h-24 w-full object-cover"
          />
        </div>
      )}

      {/* Drag handle + actions */}
      <div className="absolute right-2 top-2 flex items-center gap-0.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded-sm p-0.5 text-muted opacity-60 transition-opacity hover:text-text focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 rounded-sm opacity-60 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 size-3.5" />
              Ubah
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
              <Trash className="mr-2 size-3.5" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Priority indicator line */}
      <div className={cn("mb-2 h-0.5 w-8 rounded-full", priorityColors[task.priority] ?? "bg-primary")} />

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map(({ label }) => (
            <span
              key={label.id}
              className="inline-block rounded-md px-1.5 py-0.5 text-[9px] font-medium leading-none"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3
        role="button"
        tabIndex={0}
        className="mb-2 cursor-pointer rounded-sm text-sm leading-snug font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onEdit(task)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(task);
          }
        }}
      >
        {task.title}
      </h3>

      {/* Meta */}
      {hasMeta && (
        <div className="mb-2 flex items-center gap-2 text-[10px] text-muted">
          {task.dueDate && (
            <span className="flex items-center gap-0.5">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {task._count.comments}
            </span>
          )}
          {task._count.attachments > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip className="h-3 w-3" />
              {task._count.attachments}
            </span>
          )}
        </div>
      )}

      {/* Assignees */}
      {task.assignees.length > 0 && (
        <div className="flex items-center">
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map(({ user }) => (
              <div
                key={user.id}
                className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-surface text-[8px] font-medium"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-surface text-[8px] font-medium text-muted">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
