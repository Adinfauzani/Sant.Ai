import Navbar from "@/components/layout/navbar";
import Footer from "@santai/ui/footer";

/**
 * Chrome global untuk seluruh rute `/legal/*`.
 * Sebelumnya halaman legal berdiri sendiri tanpa navbar/footer sehingga
 * di mobile tidak ada jalur navigasi keluar (tombol "Home" ada di sidebar
 * yang hanya tampil di breakpoint lg).
 */
export default function LegalRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
