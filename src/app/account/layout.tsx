import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AccountNav from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-main py-8">
          <h1 className="text-xl font-bold text-text md:text-2xl">Account Settings</h1>
          <div className="mt-6 flex flex-col gap-8 md:flex-row">
            <AccountNav />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
