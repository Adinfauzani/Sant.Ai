"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateProfileSettings } from "@/lib/projects/actions";
import { TwinOrbit } from "@santai/ui/twinOrbit";

interface Links {
  github: string;
  linkedin: string;
  portfolio: string;
  googleScholar: string;
  orcid: string;
  kaggle: string;
}

interface Props {
  socialLinks: Links;
}

const defaultLinks: Links = {
  github: "",
  linkedin: "",
  portfolio: "",
  googleScholar: "",
  orcid: "",
  kaggle: "",
};

const LINK_FIELDS: { key: keyof Links; label: string; placeholder: string }[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "portfolio", label: "Portofolio", placeholder: "https://your-portfolio.com" },
  { key: "googleScholar", label: "Google Scholar", placeholder: "https://scholar.google.com/..." },
  { key: "orcid", label: "ORCID", placeholder: "https://orcid.org/0000-0000-0000-0000" },
  { key: "kaggle", label: "Kaggle", placeholder: "https://kaggle.com/username" },
];

export default function SectionSocialLinks({ socialLinks }: Props) {
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState<Links>({ ...defaultLinks, ...socialLinks });

  const hasChanges = JSON.stringify(links) !== JSON.stringify({ ...defaultLinks, ...socialLinks });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileSettings({ socialLinks: links });
      toast.success("Tautan sosial tersimpan");
    } catch (e: any) {
      toast.error(e.message || "Gagal memperbarui");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Tautan Sosial</h3>
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
        {LINK_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-xs text-muted">{field.label}</label>
            <input
              value={links[field.key]}
              onChange={(e) => setLinks({ ...links, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted focus:border-primary"
            />
          </div>
        ))}
        <p className="text-[10px] text-muted">Kosongin kolomnya biar nggak muncul di profilmu.</p>
      </div>
    </div>
  );
}
