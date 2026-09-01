import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";

export default function IntelPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
