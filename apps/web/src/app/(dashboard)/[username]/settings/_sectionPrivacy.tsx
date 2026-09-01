"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Cookie } from "lucide-react";
import { updateProfileSettings } from "@/lib/actions";
import { useCookieConsent } from "@/components/cookie-provider";
import CookiePreferencesDialog from "@/components/cookie-preferences-dialog";
import { Separator } from "@santai/ui/separator";

interface Privacy {
  publicProfile: boolean;
  showUniversity: boolean;
  showSkills: boolean;
  showProjects: boolean;
  allowAIPersonalization: boolean;
  showOnlineStatus: boolean;
}

interface Props {
  privacySettings: Privacy;
}

const defaultPrivacy: Privacy = {
  publicProfile: true,
  showUniversity: true,
  showSkills: true,
  showProjects: true,
  allowAIPersonalization: true,
  showOnlineStatus: true,
};

const TOGGLES: { key: keyof Privacy; label: string; description: string }[] = [
  { key: "publicProfile", label: "Public Profile", description: "Allow anyone to view your profile" },
  { key: "showUniversity", label: "Show University", description: "Display your university on your profile" },
  { key: "showSkills", label: "Show Skills", description: "Display your skills on your profile" },
  { key: "showProjects", label: "Show Projects", description: "Display your pinned projects on your profile" },
  { key: "allowAIPersonalization", label: "Allow AI Personalization", description: "Allow AI MU to use your profile data for personalization" },
  { key: "showOnlineStatus", label: "Show Online Status", description: "Show when you're active on the platform" },
];

export default function SectionPrivacy({ privacySettings }: Props) {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Privacy>({ ...defaultPrivacy, ...privacySettings });
  const { openPreferences } = useCookieConsent();

  const hasChanges = JSON.stringify(settings) !== JSON.stringify({ ...defaultPrivacy, ...privacySettings });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileSettings({ privacySettings: settings });
      toast.success("Privacy settings updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Privacy</h3>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-text px-3 py-1.5 text-[11px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {TOGGLES.map((t) => (
          <div key={t.key} className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-3 py-2.5">
            <div>
              <p className="text-xs font-medium text-text">{t.label}</p>
              <p className="text-[10px] text-muted">{t.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings[t.key]}
              onClick={() => setSettings({ ...settings, [t.key]: !settings[t.key] })}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${settings[t.key] ? "bg-primary" : "bg-border"}`}
            >
              <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${settings[t.key] ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-text">Cookie Preferences</h3>
          </div>
          <button
            type="button"
            onClick={openPreferences}
            className="rounded-md bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Manage Cookies
          </button>
        </div>
        <p className="text-[11px] text-muted">
          Control how we use cookies to improve your experience, personalize content, analyze traffic, and enhance AI-powered features.
        </p>
      </div>
    </div>
  );
}
