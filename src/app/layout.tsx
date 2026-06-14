import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import AuthProvider from "@/components/shared/auth-provider";
import FirebaseProvider from "@/components/shared/firebase-provider";
import "./globals.css";

const dancingScript = localFont({
  src: "../../public/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf",
  variable: "--font-dancing-script",
  display: "swap",
});


export const metadata: Metadata = {
  title: "SANTET | Sains & Technology",
  description:
    "Platform kolaborasi proyek antar mahasiswa Fakultas Ilmu Komputer Universitas Saintek Muhammadiyah. Bangun proyek nyata, bangun portofolio, bangun karir.",
  openGraph: {
    title: "SANTET | Sains & Technology",
    description:
      "Platform kolaborasi proyek antar mahasiswa Fakultas Ilmu Komputer Universitas Saintek Muhammadiyah.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${dancingScript.variable}`}
      >
        <AuthProvider>
          <FirebaseProvider>{children}</FirebaseProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
