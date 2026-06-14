"use client";

import { Card } from "../_components";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Settings</h1>
        <p className="mt-0.5 text-xs text-muted">Dashboard and account configuration</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Account">
          <div className="space-y-3">
            {[
              { label: "Name", value: "Admin User" },
              { label: "Email", value: "admin@santet.ac.id" },
              { label: "Role", value: "Administrator" },
              { label: "Institution", value: "Universitas Saintek Muhammadiyah" },
              { label: "Faculty", value: "Fakultas Ilmu Komputer" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg bg-surface/20 px-3 py-2">
                <span className="text-[10px] text-muted">{f.label}</span>
                <span className="text-[10px] font-medium text-text">{f.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Dashboard Preferences">
          <div className="space-y-3">
            {[
              { label: "Default Time Range", value: "Last 30 Days" },
              { label: "Default Category", value: "All Categories" },
              { label: "Items Per Page", value: "10" },
              { label: "Theme", value: "Dark Mode" },
              { label: "Notifications", value: "Enabled" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-lg bg-surface/20 px-3 py-2">
                <span className="text-[10px] text-muted">{f.label}</span>
                <span className="text-[10px] font-medium text-text">{f.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="System Information">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Version", value: "1.0.0" },
            { label: "Last Updated", value: "14 Jun 2026" },
            { label: "Data Sources", value: "10 Active" },
            { label: "Keywords", value: "156 Tracked" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-surface/20 px-3 py-2.5">
              <p className="text-[9px] text-muted">{s.label}</p>
              <p className="text-xs font-bold text-text">{s.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
