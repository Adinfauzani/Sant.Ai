"use client";

interface Props {
  user: {
    coverImage: string | null;
  };
}

export default function ProfileHeader({ user }: Props) {
  if (!user.coverImage) return null;

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-border bg-gradient-to-b from-primary/5 to-surface/30">
      <div className="h-32 w-full overflow-hidden md:h-40">
        <img src={user.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
