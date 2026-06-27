interface Props {
  studyProgram: string;
  semester: number;
}

const programLabels: Record<string, string> = {
  SD: "Sains Data",
  TI: "Teknik Informatika",
  SI: "Sistem Informasi",
};

export default function OrgBadge({ studyProgram, semester }: Props) {
  const label = programLabels[studyProgram] || studyProgram;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
      {label} &middot; Semester {semester}
    </span>
  );
}
