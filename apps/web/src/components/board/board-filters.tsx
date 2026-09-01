"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@santai/ui/input";
import { Button } from "@santai/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@santai/ui/select";
import { Badge } from "@santai/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@santai/shared";

interface FilterProps {
  members: { user: { id: string; name: string; image: string | null } }[];
  labels: { id: string; name: string; color: string }[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  assigneeId: string;
  labelId: string;
  priority: string;
}

export function BoardFilters({ members, labels, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    assigneeId: "",
    labelId: "",
    priority: "",
  });

  const hasFilters = filters.search || filters.assigneeId || filters.labelId || filters.priority;

  const updateFilter = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const clearFilters = () => {
    const cleared = { search: "", assigneeId: "", labelId: "", priority: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-2">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search tasks..."
          className="h-8 pl-8 text-sm"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        {filters.search && (
          <button
            onClick={() => updateFilter("search", "")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Select value={filters.assigneeId} onValueChange={(v) => updateFilter("assigneeId", v)}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Members</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.user.id} value={m.user.id}>
              {m.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.labelId} onValueChange={(v) => updateFilter("labelId", v)}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Label" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Labels</SelectItem>
          {labels.map((l) => (
            <SelectItem key={l.id} value={l.id}>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                {l.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(v) => updateFilter("priority", v)}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="Urgent">Urgent</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters}>
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  );
}
