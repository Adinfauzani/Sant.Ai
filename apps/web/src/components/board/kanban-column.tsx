"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@santai/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@santai/ui/dropdown-menu";
import { TaskCard } from "./task-card";

interface TaskData {
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

interface KanbanColumnProps {
  column: { id: string; name: string; color: string };
  tasks: TaskData[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: TaskData) => void;
  onDeleteTask: (taskId: string) => void;
  onRenameColumn: (columnId: string, name: string) => void;
  onDeleteColumn: (columnId: string) => void;
  readOnly?: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onRenameColumn,
  onDeleteColumn,
  readOnly,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(column.name);

  const { setNodeRef, isOver, active } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const taskIds = tasks.map((t) => t.id);

  const handleRename = () => {
    if (editName.trim() && editName !== column.name) {
      onRenameColumn(column.id, editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex w-[280px] shrink-0 flex-col rounded-xl bg-surface/50",
        isOver && "bg-primary/5 ring-1 ring-primary/20"
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {column.color && (
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: column.color }}
            />
          )}
          {isEditing ? (
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="h-6 w-32 rounded-md border border-border bg-background px-2 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/50"
            />
          ) : (
            <h3
              className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
              onClick={() => {
                setEditName(column.name);
                setIsEditing(true);
              }}
            >
              {column.name}
            </h3>
          )}
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-border/50 px-1.5 text-[10px] font-medium text-muted">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddTask(column.id)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => {
                  setEditName(column.name);
                  setIsEditing(true);
                }}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Rename
              </DropdownMenuItem>
              {!readOnly && (
                <DropdownMenuItem
                  onClick={() => onDeleteColumn(column.id)}
                  className="text-red-500"
                >
                  <Trash className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tasks drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 px-2 pb-2 min-h-[60px] transition-colors",
          tasks.length === 0 && "flex-1"
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && isOver && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-primary/30 py-6 text-xs text-muted">
            Drop here
          </div>
        )}
      </div>

      {/* Add task button at bottom */}
      {!readOnly && (
        <div className="px-2 pb-2">
          <button
            onClick={() => onAddTask(column.id)}
            className="flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add task
          </button>
        </div>
      )}
    </div>
  );
}
