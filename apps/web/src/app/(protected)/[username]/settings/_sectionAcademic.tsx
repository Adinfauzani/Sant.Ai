"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateProfileSettings } from "@/lib/projects/actions";
import { TwinOrbit } from "@santai/ui/twinOrbit";

interface Props {
  user: {
    studyProgram: string | null;
    semester: number | null;
    university: string;
    faculty: string;
    degreeLevel: string;
    studentId: string;
    enrollmentYear: number | null;
  };
}

const degreeLevels = [
  { value: "D3", label: "D3 — Diploma" },
  { value: "D4", label: "D4 — Sarjana Terapan" },
  { value: "S1", label: "S1 — Sarjana" },
  { value: "S2", label: "S2 — Magister" },
  { value: "S3", label: "S3 — Doktor" },
];

export default function SectionAcademic({ user }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    university: user.university,
    faculty: user.faculty,
    degreeLevel: user.degreeLevel,
    studentId: user.studentId,
    enrollmentYear: user.enrollmentYear ?? new Date().getFullYear(),
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileSettings({
        university: form.university,
        faculty: form.faculty,
        degreeLevel: form.degreeLevel,
        studentId: form.studentId,
        enrollmentYear: form.enrollmentYear,
      });
      toast.success("Info akademik tersimpan");
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    form.university !== user.university ||
    form.faculty !== user.faculty ||
    form.degreeLevel !== user.degreeLevel ||
    form.studentId !== user.studentId ||
    form.enrollmentYear !== user.enrollmentYear;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Informasi Akademik</h3>
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
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="mb-1 block text-xs text-muted">Universitas</label>
          <input
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            placeholder="Universitas Saintek Muhammadiyah"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs text-muted">Fakultas</label>
          <input
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            placeholder="Fakultas Ilmu Komputer"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Program Studi</label>
          <p className="rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text">
            {user.studyProgram || "—"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Semester</label>
          <p className="rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text">
            {user.semester ?? "—"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Jenjang Pendidikan</label>
          <select
            value={form.degreeLevel}
            onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-primary"
          >
            <option value="">Pilih jenjang</option>
            {degreeLevels.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">NIM</label>
          <input
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            placeholder="Opsional"
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-xs text-muted">Tahun Masuk</label>
          <input
            type="number"
            value={form.enrollmentYear}
            onChange={(e) => setForm({ ...form, enrollmentYear: parseInt(e.target.value) || 2024 })}
            min={2000}
            max={2030}
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
