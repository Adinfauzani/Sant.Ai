import Navbar from "@/components/layout/navbar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
