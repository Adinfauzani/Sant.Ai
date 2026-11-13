"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import {
  listAimProjects,
  type AimChatSummary,
  type AimProjectOption,
} from "@/lib/ai/aimuActions";

/** Konfirmasi sebelum percakapan dihapus permanen. */
export function DeleteChatDialog({
  chat,
  onCancel,
  onConfirm,
}: {
  chat: AimChatSummary;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus percakapan?</DialogTitle>
          <DialogDescription>
            &ldquo;{chat.title}&rdquo; beserta seluruh pesannya akan dihapus
            permanen. Tindakan ini tidak bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Tautkan percakapan ke salah satu proyek milik pengguna. Proyek dipakai
 * sebagai filter "Proyek" di sidebar, bukan sistem percakapan terpisah.
 */
export function MoveToProjectDialog({
  chat,
  onCancel,
  onSave,
}: {
  chat: AimChatSummary;
  onCancel: () => void;
  onSave: (projectId: string | null) => Promise<void>;
}) {
  const [projects, setProjects] = useState<AimProjectOption[] | null>(null);
  const [value, setValue] = useState(chat.projectId ?? "none");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    listAimProjects()
      .then((items) => {
        if (active) setProjects(items);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await onSave(value === "none" ? null : value);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Pindahkan ke proyek</DialogTitle>
          <DialogDescription>
            Tautkan &ldquo;{chat.title}&rdquo; ke salah satu proyekmu supaya
            mudah ditemukan lewat filter Proyek.
          </DialogDescription>
        </DialogHeader>

        <Select value={value} onValueChange={setValue}>
          <SelectTrigger aria-label="Pilih proyek">
            <SelectValue placeholder="Pilih proyek" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tanpa proyek</SelectItem>
            {(projects ?? []).map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {projects && projects.length === 0 && (
          <p className="text-xs text-muted">
            Kamu belum punya proyek. Buat proyek dulu untuk menautkan
            percakapan.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onCancel}>
            Batal
          </Button>
          <Button size="sm" onClick={() => void save()} disabled={busy}>
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
