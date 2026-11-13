"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateProfileSettings } from "@/lib/projects/actions";
import { TwinOrbit } from "@santai/ui/twinOrbit";

interface Research {
  researchInterests: string;
  currentResearchTopic: string;
  favoriteAcademicFields: string;
  academicGoals: string;
}

interface Props {
  researchProfile: Research;
}

const defaultResearch: Research = {
  researchInterests: "",
  currentResearchTopic: "",
  favoriteAcademicFields: "",
  academicGoals: "",
};

export default function SectionResearch({ researchProfile }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Research>({ ...defaultResearch, ...researchProfile });

  const hasChanges = JSON.stringify(form) !== JSON.stringify({ ...defaultResearch, ...researchProfile });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileSettings({ researchProfile: form });
      toast.success("Profil riset tersimpan");
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Profil Riset</h3>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-text px-3 py-1.5 text-[11px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving && <TwinOrbit className="size-3" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Minat Riset</label>
          <input
            value={form.researchInterests}
            onChange={(e) => setForm({ ...form, researchInterests: e.target.value })}
            placeholder="mis. Machine Learning, NLP, Computer Vision"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Topik Riset Saat Ini</label>
          <input
            value={form.currentResearchTopic}
            onChange={(e) => setForm({ ...form, currentResearchTopic: e.target.value })}
            placeholder="mis. Analisis Sentimen untuk Tweet Bahasa Indonesia"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Bidang Akademik Favorit</label>
          <input
            value={form.favoriteAcademicFields}
            onChange={(e) => setForm({ ...form, favoriteAcademicFields: e.target.value })}
            placeholder="mis. Matematika, Statistika, Linguistik"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Tujuan Akademik</label>
          <textarea
            value={form.academicGoals}
            onChange={(e) => setForm({ ...form, academicGoals: e.target.value })}
            rows={2}
            placeholder="Apa yang ingin kamu capai di perjalanan akademikmu?"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary resize-none"
          />
        </div>
        <p className="text-[10px] text-muted">Semua kolom opsional.</p>
      </div>
    </div>
  );
}
