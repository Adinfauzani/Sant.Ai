import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import AuthProvider from "@/components/shared/auth-provider";
import FirebaseProvider from "@/components/shared/firebase-provider";
import "./globals.css";

const dancingScript = localFont({
  src: "../../public/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf",
  variable: "--font-dancing-script",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
        className={`${dancingScript.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <AuthProvider>
          <FirebaseProvider>{children}</FirebaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
