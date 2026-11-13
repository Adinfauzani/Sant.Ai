export interface CompletenessItem {
  label: string;
  done: boolean;
}

export function parseJsonList(json: string): string[] {
  try {
    const value = JSON.parse(json);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function profileCompleteness(user: {
  image: string | null;
  bio: string;
  studyProgram: string | null;
  semester: number | null;
  university: string;
  faculty: string;
  skills: string;
  interests: string;
  socialLinks: string;
  readme: string;
  location: string | null;
  website: string | null;
}): { score: number; items: CompletenessItem[] } {
  const items: CompletenessItem[] = [
    { label: "Foto profil", done: Boolean(user.image) },
    { label: "Bio", done: user.bio.trim().length > 0 },
    { label: "Program studi", done: Boolean(user.studyProgram) },
    { label: "Semester", done: typeof user.semester === "number" },
    { label: "Universitas", done: user.university.trim().length > 0 },
    { label: "Fakultas", done: user.faculty.trim().length > 0 },
    { label: "Keahlian", done: parseJsonList(user.skills).length > 0 },
    { label: "Minat", done: parseJsonList(user.interests).length > 0 },
    { label: "Profil README", done: user.readme.trim().length > 0 },
    { label: "Lokasi", done: Boolean(user.location) },
    { label: "Website", done: Boolean(user.website) },
    { label: "Tautan sosial", done: user.socialLinks.trim().length > 0 && user.socialLinks !== "{}" },
  ];

  const done = items.filter((i) => i.done).length;
  return { score: Math.round((done / items.length) * 100), items };
}