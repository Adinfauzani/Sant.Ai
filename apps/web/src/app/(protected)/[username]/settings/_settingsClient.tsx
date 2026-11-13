"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Shield, KeyRound, ChevronLeft, LogOut } from "lucide-react";
import LinkedAccountsSection from "./_linkedAccounts";
import VerificationSection from "./_verification";
import TwoFactorSection from "./_twoFactor";
import SetPasswordForm from "./_setPassword";
import LogoutButton from "@/components/profile/logoutButton";
import SectionBasicInfo from "./_sectionBasicInfo";
import SectionAcademic from "./_sectionAcademic";
import SectionInterests from "./_sectionInterests";
import SectionSkills from "./_sectionSkills";
import SectionAIPreferences from "./_sectionAIPreferences";
import SectionResearch from "./_sectionResearch";
import SectionSocialLinks from "./_sectionSocialLinks";
import SectionPrivacy from "./_sectionPrivacy";

function safeJsonParse<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

const tabs = [
  { id: "account", label: "Akun", icon: User },
  { id: "security", label: "Keamanan", icon: Shield },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface Props {
  emailVerified: boolean;
  email: string;
  linkedProviders: string[];
  providerAccounts: { providerId: string; accountId: string }[];
  hasPassword: boolean;
  allMethods: string[];
  username: string | null | undefined;
  user: {
    name: string;
    username: string | null;
    email: string;
    bio: string;
    image: string | null;
    website: string | null;
    location: string | null;
    studyProgram: string | null;
    semester: number | null;
    readme: string;
    phone: string | null;
    university: string;
    faculty: string;
    degreeLevel: string;
    studentId: string;
    enrollmentYear: number | null;
    interests: string;
    skills: string;
    aiPreferences: string;
    researchProfile: string;
    socialLinks: string;
    privacySettings: string;
  };
  twoFactorEnabled: boolean;
}

export default function SettingsClient(props: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  const interests = safeJsonParse<string[]>(props.user.interests, []);
  const skills = safeJsonParse<string[]>(props.user.skills, []);
  const aiPreferences = safeJsonParse(props.user.aiPreferences, {
    preferredLanguage: "Indonesian",
    preferredResponseStyle: "Concise",
    aiPersonalization: true,
    conversationMemory: true,
    smartSuggestions: true,
  });
  const researchProfile = safeJsonParse(props.user.researchProfile, {
    researchInterests: "",
    currentResearchTopic: "",
    favoriteAcademicFields: "",
    academicGoals: "",
  });
  const socialLinks = safeJsonParse(props.user.socialLinks, {
    github: "", linkedin: "", portfolio: "",
    googleScholar: "", orcid: "", kaggle: "",
  });
  const privacySettings = safeJsonParse(props.user.privacySettings, {
    publicProfile: true,
    showUniversity: true,
    showSkills: true,
    showProjects: true,
    allowAIPersonalization: true,
    showOnlineStatus: true,
  });

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="sticky top-20 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Back to Profile */}
        <a
          href={`/${props.username}`}
          className="mb-4 flex items-center gap-1 text-[11px] text-muted hover:text-text"
        >
          <ChevronLeft className="h-3 w-3" />
          Kembali ke Profil
        </a>

        {/* Mobile tab selector */}
        <div className="mb-6 flex gap-1 overflow-x-auto md:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface hover:text-text",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "account" && (
          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionBasicInfo user={props.user} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionAcademic user={props.user} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionInterests interests={interests} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionSkills skills={skills} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionAIPreferences aiPreferences={aiPreferences} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionResearch researchProfile={researchProfile} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionSocialLinks socialLinks={socialLinks} />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <SectionPrivacy privacySettings={privacySettings} />
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <LinkedAccountsSection
                linkedProviders={props.linkedProviders}
                providerAccounts={props.providerAccounts}
                hasPassword={props.hasPassword}
                allMethods={props.allMethods}
                username={props.username}
              />
            </section>

            {!props.hasPassword && (
              <section className="rounded-lg border border-border bg-surface/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-muted" />
                  <h2 className="text-sm font-semibold text-text">Password</h2>
                </div>
                <p className="mb-3 text-[11px] text-muted">
                  Kamu mendaftar pakai akun sosial. Set password biar bisa masuk pakai email/password.
                </p>
                <SetPasswordForm />
              </section>
            )}

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <VerificationSection
                emailVerified={props.emailVerified}
                email={props.email}
              />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <TwoFactorSection
                twoFactorEnabled={props.twoFactorEnabled}
                hasPassword={props.hasPassword}
              />
            </section>

            <section className="rounded-lg border border-border bg-surface/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <LogOut className="h-4 w-4 text-destructive" />
                <h2 className="text-sm font-semibold text-text">Sesi</h2>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted">
                  Keluar dari akunmu di perangkat ini.
                </p>
                <LogoutButton />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
