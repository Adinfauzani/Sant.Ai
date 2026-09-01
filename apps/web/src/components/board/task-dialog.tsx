"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@santai/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@santai/ui/select";
import { Button } from "@santai/ui/button";
import { Input } from "@santai/ui/input";
import { Checkbox } from "@santai/ui/checkbox";
import { Badge } from "@santai/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@santai/ui/avatar";
import { Separator } from "@santai/ui/separator";
import {
  Calendar,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Clock,
  Trash,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Link,
  User,
  Tag,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
  createChecklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  addTaskAssignee,
  removeTaskAssignee,
  addTaskLabel,
  removeTaskLabel,
  getTaskDetail,
  getBoardActivity,
} from "@/lib/board-actions";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  taskId: string;
  boardId: string;
  members: { user: { id: string; name: string; image: string | null; email: string } }[];
  labels: { id: string; name: string; color: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (task: any) => void;
}

const priorityOptions = [
  { value: "Urgent", color: "bg-red-500", text: "text-red-500" },
  { value: "High", color: "bg-orange-500", text: "text-orange-500" },
  { value: "Medium", color: "bg-blue-500", text: "text-blue-500" },
  { value: "Low", color: "bg-gray-400", text: "text-gray-400" },
];

export function TaskDialog({
  taskId,
  boardId,
  members,
  labels,
  open,
  onOpenChange,
  onUpdated,
}: TaskDialogProps) {
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState<Record<string, string>>({});
  const [activity, setActivity] = useState<any[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const loadTask = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTaskDetail(taskId);
      setTask(data);
      setEditTitle(data?.title ?? "");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const loadActivity = useCallback(async () => {
    try {
      const data = await getBoardActivity(boardId);
      setActivity(data.filter((a: any) => a.taskId === taskId));
    } catch {}
  }, [boardId, taskId]);

  useEffect(() => {
    if (open) {
      loadTask();
      loadActivity();
    }
  }, [open, loadTask, loadActivity]);

  const handleUpdate = async (data: any) => {
    try {
      const updated = await updateTask(taskId, data);
      setTask((prev: any) => ({ ...prev, ...updated }));
      onUpdated(updated);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(taskId);
    onOpenChange(false);
    router.refresh();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const c = await addComment(taskId, comment.trim());
    setTask((prev: any) => ({
      ...prev,
      comments: [...(prev?.comments ?? []), c],
    }));
    setComment("");
  };

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    const cl = await createChecklist(taskId, newChecklistTitle.trim());
    setTask((prev: any) => ({
      ...prev,
      checklists: [...(prev?.checklists ?? []), { ...cl, items: [] }],
    }));
    setNewChecklistTitle("");
  };

  const handleAddItem = async (checklistId: string) => {
    const content = newItemContent[checklistId];
    if (!content?.trim()) return;
    const item = await addChecklistItem(checklistId, content.trim());
    setTask((prev: any) => ({
      ...prev,
      checklists: prev.checklists.map((cl: any) =>
        cl.id === checklistId
          ? { ...cl, items: [...cl.items, item] }
          : cl
      ),
    }));
    setNewItemContent((prev) => ({ ...prev, [checklistId]: "" }));
  };

  const handleToggleItem = async (itemId: string, completed: boolean) => {
    await toggleChecklistItem(itemId, completed);
    setTask((prev: any) => ({
      ...prev,
      checklists: prev.checklists.map((cl: any) => ({
        ...cl,
        items: cl.items.map((it: any) =>
          it.id === itemId ? { ...it, completed } : it
        ),
      })),
    }));
  };

  const handleAssigneeToggle = async (userId: string) => {
    const has = task.assignees?.some((a: any) => a.user.id === userId);
    if (has) {
      await removeTaskAssignee(taskId, userId);
    } else {
      await addTaskAssignee(taskId, userId);
    }
    loadTask();
  };

  const handleLabelToggle = async (labelId: string) => {
    const has = task.labels?.some((l: any) => l.label.id === labelId);
    if (has) {
      await removeTaskLabel(taskId, labelId);
    } else {
      await addTaskLabel(taskId, labelId);
    }
    loadTask();
  };

  if (!open) return null;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-20">
            <Loader className="h-6 w-6 animate-spin text-muted" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) return null;

  const totalItems = task.checklists?.reduce(
    (sum: number, cl: any) => sum + cl.items.length,
    0
  ) ?? 0;
  const completedItems = task.checklists?.reduce(
    (sum: number, cl: any) => sum + cl.items.filter((i: any) => i.completed).length,
    0
  ) ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        <div className="flex flex-col">
          {/* Cover */}
          {task.coverImage && (
            <div className="h-32 w-full overflow-hidden rounded-t-xl">
              <img
                src={task.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            {/* Title */}
            <div className="mb-4">
              {titleEditing ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    if (editTitle.trim() && editTitle !== task.title) {
                      handleUpdate({ title: editTitle.trim() });
                    }
                    setTitleEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editTitle.trim() && editTitle !== task.title) {
                        handleUpdate({ title: editTitle.trim() });
                      }
                      setTitleEditing(false);
                    }
                    if (e.key === "Escape") {
                      setEditTitle(task.title);
                      setTitleEditing(false);
                    }
                  }}
                  className="w-full text-xl font-bold bg-transparent outline-none border-b border-border pb-1 focus:border-primary"
                />
              ) : (
                <h2
                  className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setTitleEditing(true)}
                >
                  {task.title}
                </h2>
              )}
            </div>

            <div className="flex gap-8">
              {/* Main content */}
              <div className="flex-1 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                    Description
                  </h4>
                  <textarea
                    value={task.description}
                    onChange={(e) =>
                      setTask((prev: any) => ({ ...prev, description: e.target.value }))
                    }
                    onBlur={() => {
                      handleUpdate({ description: task.description });
                    }}
                    placeholder="Add a description in Markdown..."
                    className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted"
                  />
                </div>

                {/* Checklist */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Checklist {totalItems > 0 && `(${completedItems}/${totalItems})`}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setNewChecklistTitle("Untitled Checklist")}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Checklist
                    </Button>
                  </div>

                  {newChecklistTitle && (
                    <div className="mb-2 flex items-center gap-1.5">
                      <Input
                        placeholder="Checklist title"
                        value={newChecklistTitle}
                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddChecklist();
                          if (e.key === "Escape") setNewChecklistTitle("");
                        }}
                        className="h-7 text-xs"
                      />
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={handleAddChecklist}
                      >
                        Add
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {task.checklists?.map((cl: any) => (
                      <div key={cl.id} className="rounded-lg border border-border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">{cl.title}</span>
                          <span className="text-[10px] text-muted">
                            {cl.items.filter((i: any) => i.completed).length}/{cl.items.length}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {cl.items.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-2 group">
                              <Checkbox
                                checked={item.completed}
                                onCheckedChange={(v) =>
                                  handleToggleItem(item.id, !!v)
                                }
                                className="h-3.5 w-3.5"
                              />
                              <span
                                className={cn(
                                  "flex-1 text-sm",
                                  item.completed && "line-through text-muted"
                                )}
                              >
                                {item.content}
                              </span>
                              <button
                                onClick={() => deleteChecklistItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          <Input
                            placeholder="Add item..."
                            value={newItemContent[cl.id] ?? ""}
                            onChange={(e) =>
                              setNewItemContent((prev) => ({
                                ...prev,
                                [cl.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddItem(cl.id);
                            }}
                            className="h-7 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleAddItem(cl.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    Comments ({task.comments?.length ?? 0})
                  </h4>
                  <div className="space-y-3">
                    {task.comments?.map((c: any) => (
                      <div key={c.id} className="flex gap-2">
                        <Avatar className="h-6 w-6">
                          {c.user.image ? (
                            <AvatarImage src={c.user.image} />
                          ) : (
                            <AvatarFallback className="text-[10px]">
                              {c.user.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{c.user.name}</span>
                            <span className="text-[10px] text-muted">
                              {new Date(c.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <div className="flex-1">
                      <textarea
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleComment();
                          }
                        }}
                        className="w-full resize-none rounded-lg border border-border bg-background p-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted min-h-[36px]"
                        rows={1}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="h-9"
                      onClick={handleComment}
                      disabled={!comment.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar properties */}
              <div className="w-56 shrink-0 space-y-4">
                {/* Status/Column */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Status
                  </h5>
                  <p className="text-sm">{task.column?.name ?? "Unknown"}</p>
                </div>

                {/* Priority */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Priority
                  </h5>
                  <Select
                    value={task.priority}
                    onValueChange={(v) => handleUpdate({ priority: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full", p.color)} />
                            {p.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignees */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Assignees
                  </h5>
                  <div className="space-y-1">
                    {members.map((m) => {
                      const assigned = task.assignees?.some(
                        (a: any) => a.user.id === m.user.id
                      );
                      return (
                        <button
                          key={m.user.id}
                          onClick={() => handleAssigneeToggle(m.user.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors",
                            assigned
                              ? "bg-primary/10 text-foreground"
                              : "text-muted hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <Avatar className="h-5 w-5">
                            {m.user.image ? (
                              <AvatarImage src={m.user.image} />
                            ) : (
                              <AvatarFallback className="text-[8px]">
                                {m.user.name.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="flex-1 text-left truncate">{m.user.name}</span>
                          {assigned && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Labels
                  </h5>
                  <div className="space-y-1">
                    {labels.map((l) => {
                      const has = task.labels?.some(
                        (tl: any) => tl.label.id === l.id
                      );
                      return (
                        <button
                          key={l.id}
                          onClick={() => handleLabelToggle(l.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors",
                            has
                              ? "text-foreground"
                              : "text-muted hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: l.color }}
                          />
                          <span className="flex-1 text-left">{l.name}</span>
                          {has && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Due date */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Due Date
                  </h5>
                  <Input
                    type="date"
                    value={
                      task.dueDate
                        ? new Date(task.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleUpdate({
                        dueDate: e.target.value || null,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                {/* Created by */}
                <div>
                  <h5 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    Created By
                  </h5>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      {task.createdBy?.image ? (
                        <AvatarImage src={task.createdBy.image} />
                      ) : (
                        <AvatarFallback className="text-[8px]">
                          {task.createdBy?.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-xs">{task.createdBy?.name}</span>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <button
                    onClick={() => setShowActivity(!showActivity)}
                    className="flex w-full items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted"
                  >
                    {showActivity ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    Activity
                  </button>
                  {showActivity && (
                    <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto">
                      {activity.slice(0, 20).map((a: any) => (
                        <div key={a.id} className="text-[10px] text-muted">
                          <span className="font-medium text-foreground">
                            {a.actor?.name}
                          </span>{" "}
                          {a.action}
                          <br />
                          <span>{new Date(a.createdAt).toLocaleString()}</span>
                        </div>
                      ))}
                      {activity.length === 0 && (
                        <p className="text-[10px] text-muted">No activity yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Delete */}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start text-xs text-red-500 hover:text-red-500 hover:bg-red-500/10"
                    onClick={handleDelete}
                  >
                    <Trash className="mr-1.5 h-3.5 w-3.5" />
                    Delete Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
