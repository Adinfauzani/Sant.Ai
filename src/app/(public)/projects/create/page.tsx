"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/actions";

export default function CreateProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <GraduationCap className="mb-4 h-10 w-10 text-primary" />
        <h1 className="font-heading text-xl font-bold text-text">Login Required</h1>
        <p className="mt-1 text-sm text-muted">You need to login to create a project.</p>
        <Link href="/login">
          <Button className="mt-4">Login</Button>
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      await createProject(form);
      // redirect happens in the server action
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container-main py-8">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mx-auto mt-6 max-w-xl">
          <h1 className="font-heading text-2xl font-bold text-text">Create Project</h1>
          <p className="mt-1 text-sm text-muted">
            Start a new collaborative project
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text">
                Project Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="problemStatement" className="block text-sm font-medium text-text">
                Problem Statement (optional)
              </label>
              <textarea
                id="problemStatement"
                name="problemStatement"
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-text">
                Tech Stack (comma separated)
              </label>
              <input
                id="techStack"
                name="techStack"
                type="text"
                placeholder="e.g. React, Python, TensorFlow"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-text">Team Requirements</p>
              <p className="text-[10px] text-muted">
                How many students from each program do you need?
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-muted">Sains Data (SD)</label>
                  <input
                    name="sd"
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={0}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted">Teknik Informatika (TI)</label>
                  <input
                    name="ti"
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={0}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted">Sistem Informasi (SI)</label>
                  <input
                    name="si"
                    type="number"
                    min={0}
                    max={10}
                    defaultValue={0}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
