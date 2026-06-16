import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="min-h-screen flex bg-surface">
      <DashboardSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar user={session.user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
