import ProfileFooter from "@/components/layout/profileFooter";

export default function UsernameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
      <ProfileFooter />
    </div>
  );
}
