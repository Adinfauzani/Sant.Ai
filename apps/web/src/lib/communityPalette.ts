const PROGRAM_COLORS = [
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-purple-600 to-violet-500",
  "from-amber-600 to-orange-500",
  "from-rose-600 to-pink-500",
  "from-sky-600 to-blue-500",
];

export function programColor(index: number): string {
  return PROGRAM_COLORS[index % PROGRAM_COLORS.length];
}

export function coverFromColor(color: string): string {
  const match = color.match(/from-(\w+)-(\d+)\s+to-(\w+)-(\d+)/);
  if (!match) return color;
  return `from-${match[1]}-600/30 to-${match[3]}-400/10`;
}