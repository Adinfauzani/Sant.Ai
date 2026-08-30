"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";
import { toggleCommunityTodo } from "@/lib/communityActions";
import type { CommunityTodoItem } from "@/lib/community";

export default function TodoList({
  communityId,
  initial,
  isLead,
}: {
  communityId: string;
  initial: CommunityTodoItem[];
  isLead: boolean;
}) {
  const [todos, setTodos] = useState(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleToggle(id: string) {
    if (pendingId) return;
    setPendingId(id);
    const res = await toggleCommunityTodo(communityId, id);
    if (res.ok) {
      setTodos((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }
    setPendingId(null);
  }

  if (todos.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-text">
        <ListTodo className="h-4 w-4 text-primary" />
        Todo Komunitas
      </h3>
      <div className="mt-3 space-y-2">
        {todos.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5"
          >
            {isLead ? (
              <button
                type="button"
                onClick={() => handleToggle(t.id)}
                className="mt-0.5 shrink-0 text-muted transition-colors hover:text-primary"
                aria-label="Toggle todo"
              >
                {t.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
            ) : (
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${t.done ? "text-emerald-400" : "text-muted/40"}`}
              />
            )}
            <span className={`text-[11px] ${t.done ? "text-muted line-through decoration-border" : "text-text"}`}>
              {t.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}