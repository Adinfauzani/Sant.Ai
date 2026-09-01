"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@santai/ui/button";
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
import { KanbanColumn } from "./kanban-column";
import { TaskDialog } from "./task-dialog";
import { BoardFilters, type FilterState } from "./board-filters";
import { TaskCard } from "./task-card";
import {
  createColumn,
  createTask,
  updateColumn,
  deleteColumn,
  deleteTask,
  moveTask,
  reorderColumns,
  reorderTasks,
} from "@/lib/board-actions";
import { cn } from "@/lib/utils";

interface BoardData {
  id: string;
  name: string;
  description: string;
  icon: string;
  visibility: string;
  ownerId: string;
  owner: { id: string; name: string; image: string | null };
  _count: { tasks: number };
  columns: {
    id: string;
    name: string;
    order: number;
    color: string;
    tasks: {
      id: string;
      title: string;
      priority: string;
      dueDate: string | null;
      coverImage: string | null;
      order: number;
      assignees: { user: { id: string; name: string; image: string | null } }[];
      labels: { label: { id: string; name: string; color: string } }[];
      _count: { comments: number; attachments: number };
    }[];
  }[];
  labels: { id: string; name: string; color: string }[];
  members: { user: { id: string; name: string; image: string | null; email: string } }[];
}

interface KanbanBoardProps {
  board: BoardData;
  isOwner: boolean;
}

export function KanbanBoard({ board, isOwner }: KanbanBoardProps) {
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [activeTask, setActiveTask] = useState<any>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    assigneeId: "",
    labelId: "",
    priority: "",
  });
  const [columns, setColumns] = useState(board.columns);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    setColumns(board.columns);
  }, [board.columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const isOverColumn = (activeColId: string) => activeColumn === activeColId;

  const filteredTasks = useCallback(
    (tasks: BoardData["columns"][0]["tasks"]) => {
      return tasks.filter((task) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          if (!task.title.toLowerCase().includes(q)) return false;
        }
        if (filters.assigneeId) {
          if (!task.assignees.some((a) => a.user.id === filters.assigneeId))
            return false;
        }
        if (filters.labelId) {
          if (!task.labels.some((l) => l.label.id === filters.labelId))
            return false;
        }
        if (filters.priority) {
          if (task.priority !== filters.priority) return false;
        }
        return true;
      });
    },
    [filters]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "task") {
      setActiveTask(data.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "task" && overData?.type === "column") {
      setActiveColumn(over.id as string);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "task") {
      const taskId = active.id as string;
      let targetColumnId = "";
      let targetOrder = 0;

      if (overData?.type === "column") {
        targetColumnId = over.id as string;
        const targetTasks = columns.find((c) => c.id === targetColumnId)?.tasks ?? [];
        targetOrder = targetTasks.length > 0
          ? Math.max(...targetTasks.map((t) => t.order)) + 1
          : 0;
      } else {
        const overTaskId = over.id as string;
        for (const col of columns) {
          const idx = col.tasks.findIndex((t) => t.id === overTaskId);
          if (idx !== -1) {
            targetColumnId = col.id;
            const overTask = col.tasks[idx];
            const activeCol = columns.find((c) =>
              c.tasks.some((t) => t.id === taskId)
            );
            if (activeCol?.id === targetColumnId) {
              const oldIdx = activeCol.tasks.findIndex((t) => t.id === taskId);
              const newIdx = col.tasks.findIndex((t) => t.id === overTaskId);
              if (oldIdx !== -1 && newIdx !== -1) {
                const moved = arrayMove(activeCol.tasks, oldIdx, newIdx);
                setColumns((prev) =>
                  prev.map((c) =>
                    c.id === targetColumnId ? { ...c, tasks: moved } : c
                  )
                );
                await reorderTasks(taskId, newIdx);
              }
              return;
            }
            const refOrder = overTask.order;
            targetOrder = idx === 0 ? refOrder / 2 : (col.tasks[idx - 1]?.order ?? 0 + refOrder) / 2;
            break;
          }
        }
      }

      const sourceCol = columns.find((c) =>
        c.tasks.some((t) => t.id === taskId)
      );
      if (!sourceCol || !targetColumnId) return;

      if (sourceCol.id === targetColumnId) {
        const col = columns.find((c) => c.id === targetColumnId)!;
        const oldIdx = col.tasks.findIndex((t) => t.id === taskId);
        const newIdx = col.tasks.findIndex((t) => t.id === over.id);
        if (oldIdx !== -1 && newIdx !== -1) {
          const moved = arrayMove(col.tasks, oldIdx, newIdx);
          setColumns((prev) =>
            prev.map((c) =>
              c.id === targetColumnId ? { ...c, tasks: moved } : c
            )
          );
        }
        return;
      }

      const task = sourceCol.tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedColumns = columns.map((col) => {
        if (col.id === sourceCol.id) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, { ...task, columnId: targetColumnId, order: targetOrder }],
          };
        }
        return col;
      });

      setColumns(updatedColumns);
      await moveTask(taskId, targetColumnId, targetOrder);
    } else if (activeData?.type === "column") {
      const oldIdx = columns.findIndex((c) => c.id === active.id);
      const newIdx = columns.findIndex((c) => c.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const reordered = arrayMove(columns, oldIdx, newIdx);
        setColumns(reordered);
        await reorderColumns(
          board.id,
          reordered.map((c) => c.id)
        );
      }
    }
  };

  const handleAddTask = async (columnId: string) => {
    setAddingToColumn(columnId);
    setNewTaskTitle("");
  };

  const handleCreateTask = async () => {
    if (!addingToColumn || !newTaskTitle.trim()) return;
    try {
      const task = await createTask(addingToColumn, { title: newTaskTitle.trim() });
      setColumns((prev) =>
        prev.map((col) =>
          col.id === addingToColumn
            ? { ...col, tasks: [...col.tasks, task as any] }
            : col
        )
      );
      setNewTaskTitle("");
      setAddingToColumn(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
    await deleteTask(taskId);
  };

  const handleRenameColumn = async (columnId: string, name: string) => {
    await updateColumn(columnId, { name });
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, name } : col))
    );
  };

  const handleDeleteColumn = async (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (col && col.tasks.length > 0) {
      if (!confirm("This column has tasks. Are you sure you want to delete it?")) return;
    }
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    await deleteColumn(columnId);
  };

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      const col = await createColumn(board.id, newColumnName.trim());
      setColumns((prev) => [
        ...prev,
        { ...(col as any), tasks: [], color: "" },
      ]);
      setNewColumnName("");
      setShowAddColumn(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTaskUpdated = (updatedTask: any) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === updatedTask.id ? { ...t, ...updatedTask } : t
        ),
      }))
    );
  };

  return (
    <div className="flex h-full flex-col">
      <BoardFilters
        members={board.members}
        labels={board.labels}
        onFilterChange={setFilters}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex h-full gap-4 p-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={filteredTasks(column.tasks)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onRenameColumn={handleRenameColumn}
                  onDeleteColumn={handleDeleteColumn}
                  readOnly={!isOwner}
                />
              ))}

              {/* Add column button */}
              {showAddColumn ? (
                <div className="flex w-[280px] shrink-0 flex-col rounded-xl border-2 border-dashed border-border bg-surface/30 p-3">
                  <Input
                    autoFocus
                    placeholder="Column name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn();
                      if (e.key === "Escape") setShowAddColumn(false);
                    }}
                    className="mb-2"
                  />
                  <div className="flex gap-1.5">
                    <Button size="sm" onClick={handleAddColumn}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowAddColumn(false);
                        setNewColumnName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddColumn(true)}
                  className="flex w-[280px] shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Add Column
                </button>
              )}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? (
              <div className="w-[264px]">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Inline new task input */}
      {addingToColumn && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 pt-[20vh]">
          <div className="w-96 rounded-xl border border-border bg-background p-4 shadow-xl">
            <h3 className="mb-3 text-sm font-medium">Add Task</h3>
            <Input
              autoFocus
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTask();
                if (e.key === "Escape") {
                  setAddingToColumn(null);
                  setNewTaskTitle("");
                }
              }}
              className="mb-3"
            />
            <div className="flex justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAddingToColumn(null);
                  setNewTaskTitle("");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateTask}>
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Task detail dialog */}
      {showTaskDialog && editingTask && (
        <TaskDialog
          taskId={editingTask.id}
          boardId={board.id}
          members={board.members}
          labels={board.labels}
          open={showTaskDialog}
          onOpenChange={(open) => {
            setShowTaskDialog(open);
            if (!open) setEditingTask(null);
          }}
          onUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}
