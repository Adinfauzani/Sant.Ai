import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bell, Mail, Users, Calendar } from "lucide-react";

export default async function AccountNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sections = [
    { icon: Mail, title: "Email Notifications", desc: "Email notification preferences coming soon." },
    { icon: Users, title: "Community Notifications", desc: "Community notification preferences coming soon." },
    { icon: Calendar, title: "Event Notifications", desc: "Event notification preferences coming soon." },
  ];

  return (
    <div className="max-w-lg space-y-6">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.title} className="rounded-lg border border-border bg-surface/5 p-4">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted" />
              <h3 className="text-sm font-medium text-text">{s.title}</h3>
            </div>
            <p className="mt-1 text-[11px] text-muted">{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
