import Navbar from "@/components/layout/navbar";
import ProfileFooter from "@/components/layout/profileFooter";

export default function UsernameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">{children}</div>
      </main>
      <ProfileFooter />
    </div>
  );
}
