import { auth } from "@/auth";
import Charlotte from "@/components/Charlotte";
import Navigation from "@/components/Navigation";
import TulipDecoration from "@/components/TulipDecoration";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? "Amor";

  return (
    <div className="min-h-screen relative">
      <TulipDecoration />
      <Navigation userName={userName} />
      <main className="relative z-10">{children}</main>
      <Charlotte />
    </div>
  );
}
