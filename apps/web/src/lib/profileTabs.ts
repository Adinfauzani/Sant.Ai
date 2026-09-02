export const PROFILE_TABS = [
  { key: "overview", label: "Overview", icon: "LayoutDashboard" },
  { key: "projects", label: "Projects", icon: "FolderGit2" },
  { key: "articles", label: "Articles", icon: "FileText" },
] as const;

export type ProfileTabKey = (typeof PROFILE_TABS)[number]["key"];