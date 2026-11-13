"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileTreeNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
};

export function FileTree({
  nodes,
  className,
  onSelect,
  selectedId,
  ...props
}: Omit<ComponentProps<"div">, "onSelect"> & {
  nodes: FileTreeNode[];
  selectedId?: string;
  onSelect?: (node: FileTreeNode) => void;
}) {
  return (
    <div
      data-slot="file-tree"
      className={cn("w-full rounded-xl border border-border bg-card/60 p-1.5", className)}
      {...props}
    >
      <ul role="tree" className="space-y-0.5 text-xs">
        {nodes.map((node) => (
          <FileTreeItem key={node.id} node={node} depth={0} onSelect={onSelect} selectedId={selectedId} />
        ))}
      </ul>
    </div>
  );
}

function FileTreeItem({
  node,
  depth,
  onSelect,
  selectedId,
}: {
  node: FileTreeNode;
  depth: number;
  onSelect?: (node: FileTreeNode) => void;
  selectedId?: string;
}) {
  const [open, setOpen] = useState(depth === 0);
  const isFolder = node.type === "folder";
  const selected = selectedId === node.id;

  return (
    <li role="treeitem" aria-expanded={isFolder ? open : undefined}>
      <button
        type="button"
        onClick={() => {
          if (isFolder) setOpen((o) => !o);
          onSelect?.(node);
        }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface",
          selected && "bg-primary-soft text-primary",
        )}
        style={{ paddingLeft: 6 + depth * 12 }}
      >
        {isFolder ? (
          <>
            <ChevronRight className={cn("size-3 text-muted transition-transform", open && "rotate-90")} />
            {open ? <FolderOpen className="size-3.5 text-primary" /> : <Folder className="size-3.5 text-primary" />}
          </>
        ) : (
          <>
            <span className="inline-block size-3" />
            <File className="size-3.5 text-muted" />
          </>
        )}
        <span className="min-w-0 truncate">{node.name}</span>
      </button>
      {isFolder && open && node.children && node.children.length > 0 ? (
        <ul role="group" className="space-y-0.5">
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeEmpty({ children = "Tidak ada berkas.", className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("px-2 py-3 text-center text-xs text-muted", className)}>{children}</div>;
}
