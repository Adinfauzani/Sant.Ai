"use client";

import { useState } from "react";
import {
  Calendar,
  MessageSquare,
  Paperclip,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Trash,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@santai/ui/badge";
import { Button } from "@santai/ui/button";
import { Checkbox } from "@santai/ui/checkbox";
import { TaskDialog } from "./task-dialog";

interface TaskData {
  id: string;
  title: string;
  priority: string;
  dueDate: string | null;
  order: number;
  columnId: string;
  assignees: { user: { id: string; name: string; image: string | null } }[];
  labels: { label: { id: string; name: string; color: string } }[];
  _count: { comments: number; attachments: number };
}

interface ColumnData {
  id: string;
  name: string;
  color: string;
  tasks: TaskData[];
}

interface BoardData {
  id: string;
  name: string;
  columns: ColumnData[];
  labels: { id: string; name: string; color: string }[];
  members: { user: { id: string; name: string; image: string | null; email: string } }[];
}

interface ListViewProps {
  board: BoardData;
}

const priorityStyles: Record<string, string> = {
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-warning/10 text-warning border-warning/20",
  Medium: "bg-primary/10 text-primary border-primary/20",
  Low: "bg-surface text-muted border-border",
};

export function ListView({ board }: ListViewProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEdit = (task: TaskData) => {
    setSelectedTask(task);
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 border-b border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
        <div className="col-span-5 pl-6">Tugas</div>
        <div className="col-span-2">Prioritas</div>
        <div className="col-span-2">Label</div>
        <div className="col-span-1">Tenggat</div>
        <div className="col-span-2">Penanggung Jawab</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {board.columns.map((column) => (
          <div key={column.id}>
            {/* Column header */}
            <button
              onClick={() => toggleCollapse(column.id)}
              className="flex w-full items-center gap-2 bg-surface/50 px-4 py-2 text-left text-sm font-medium hover:bg-accent/30 transition-colors"
            >
              {collapsed.has(column.id) ? (
                <ChevronRight className="h-3.5 w-3.5 text-muted" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              )}
              {column.color && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
              )}
              <span>{column.name}</span>
              <span className="text-xs text-muted">{column.tasks.length}</span>
            </button>

            {/* Tasks */}
            {!collapsed.has(column.id) && (
              <>
                {column.tasks.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-muted">
                    No tasks in {column.name}
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid grid-cols-12 gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-accent/20 cursor-pointer"
                      onClick={() => handleEdit(task)}
                    >
                      <div className="col-span-5 flex items-center gap-2 pl-6">
                        <span className="font-medium truncate">{task.title}</span>
                      </div>
                      <div className="col-span-2">
                        <span
                          className={cn(
                            "inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                            priorityStyles[task.priority] ??
                              "bg-surface text-muted border-border"
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {task.labels.slice(0, 2).map(({ label }) => (
                          <span
                            key={label.id}
                            className="inline-block rounded px-1 py-0.5 text-[9px] font-medium leading-none"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                        {task.labels.length > 2 && (
                          <span className="text-[9px] text-muted">
                            +{task.labels.length - 2}
                          </span>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center text-xs text-muted">
                        {task.dueDate ? (
                          <span className="flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString("id-ID", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <div className="flex -space-x-1">
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
                        </div>
                        <div className="flex items-center gap-1 ml-auto text-[10px] text-muted">
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
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskDialog
          taskId={selectedTask.id}
          boardId={board.id}
          members={board.members}
          labels={board.labels}
          open={showDialog}
          onOpenChange={(o) => {
            setShowDialog(o);
            if (!o) setSelectedTask(null);
          }}
          onUpdated={() => {}}
        />
      )}
    </div>
  );
}
