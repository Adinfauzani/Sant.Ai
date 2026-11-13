"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateProfileSettings } from "@/lib/projects/actions";
import { TwinOrbit } from "@santai/ui/twinOrbit";

interface AIPrefs {
  preferredLanguage: string;
  preferredResponseStyle: string;
  aiPersonalization: boolean;
  conversationMemory: boolean;
  smartSuggestions: boolean;
}

interface Props {
  aiPreferences: AIPrefs;
}

const LANGUAGES = ["Indonesian", "English"];
const RESPONSE_STYLES = ["Concise", "Detailed", "Academic", "Practical", "Step-by-step"];

const defaultPrefs: AIPrefs = {
  preferredLanguage: "Indonesian",
  preferredResponseStyle: "Concise",
  aiPersonalization: true,
  conversationMemory: true,
  smartSuggestions: true,
};

export default function SectionAIPreferences({ aiPreferences }: Props) {
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<AIPrefs>({ ...defaultPrefs, ...aiPreferences });

  const hasChanges = JSON.stringify(prefs) !== JSON.stringify({ ...defaultPrefs, ...aiPreferences });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileSettings({ aiPreferences: prefs });
      toast.success("Preferensi AI tersimpan");
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Preferensi AI MU</h3>
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-muted">Bahasa Pilihan</label>
            <select
              value={prefs.preferredLanguage}
              onChange={(e) => setPrefs({ ...prefs, preferredLanguage: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-primary"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Gaya Respons</label>
            <select
              value={prefs.preferredResponseStyle}
              onChange={(e) => setPrefs({ ...prefs, preferredResponseStyle: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus:border-primary"
            >
              {RESPONSE_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <ToggleRow
            label="Personalisasi AI"
            description="Izinkan AI MU belajar dari interaksi denganmu"
            checked={prefs.aiPersonalization}
            onChange={(v) => setPrefs({ ...prefs, aiPersonalization: v })}
          />
          <ToggleRow
            label="Ingatan Percakapan"
            description="AI MU mengingat konteks antar percakapan"
            checked={prefs.conversationMemory}
            onChange={(v) => setPrefs({ ...prefs, conversationMemory: v })}
          />
          <ToggleRow
            label="Saran Cerdas"
            description="Dapatkan saran otomatis berdasarkan aktivitasmu"
            checked={prefs.smartSuggestions}
            onChange={(v) => setPrefs({ ...prefs, smartSuggestions: v })}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-3 py-2.5">
      <div>
        <p className="text-xs font-medium text-text">{label}</p>
        <p className="text-[10px] text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
