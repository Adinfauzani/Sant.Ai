import Link from "next/link";

const links = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Guidelines", href: "/legal/guidelines" },
  { label: "Data", href: "/legal/data" },
  { label: "GitHub", href: "https://github.com/Adinfauzani/Sant.Ai" },
];

export default function ProfileFooter() {
  return (
    <footer className="border-t border-border">
      <div className="container-main flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()}{" "}
          Sant.Ai{" "} &mdash;
          Universitas Saintek Muhammadiyah
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-muted hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
