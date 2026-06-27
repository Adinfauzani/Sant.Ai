interface Props {
  contributions: { createdAt: Date }[];
}

export default function StreakCounter({ contributions }: Props) {
  if (contributions.length === 0) {
    return (
      <div className="flex items-center gap-4 text-xs text-muted">
        <span>No contributions yet</span>
      </div>
    );
  }

  const dates = contributions.map((c) => {
    const d = new Date(c.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const uniqueDays = [...new Set(dates)].sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  for (let i = 0; i < uniqueDays.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  if (uniqueDays[uniqueDays.length - 1] === todayStr || uniqueDays[uniqueDays.length - 1] === getYesterday()) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  function getYesterday() {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
  }

  const totalContributions = contributions.length;

  return (
    <div className="flex items-center gap-4 text-xs">
      <div className="text-center">
        <p className="font-semibold text-text">{currentStreak}</p>
        <p className="text-muted">Current streak</p>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <p className="font-semibold text-text">{longestStreak}</p>
        <p className="text-muted">Longest streak</p>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-center">
        <p className="font-semibold text-text">{totalContributions}</p>
        <p className="text-muted">Total contributions</p>
      </div>
    </div>
  );
}
