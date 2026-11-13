export const PROFILE_TABS = [
  { key: "overview", label: "Ringkasan", icon: "LayoutDashboard" },
  { key: "projects", label: "Proyek", icon: "FolderGit2" },
  { key: "articles", label: "Artikel", icon: "FileText" },
] as const;

export type ProfileTabKey = (typeof PROFILE_TABS)[number]["key"];