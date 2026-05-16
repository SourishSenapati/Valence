import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApprovalTable } from "@/components/manager/ApprovalTable";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default async function ManagerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !["SHIFT_MANAGER", "PLANT_HEAD", "HR_ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight italic">Manager Control Plane</h1>
        <p className="text-gray-400 mt-2">Audit, adjust, and lock performance targets for your direct reports.</p>
      </div>

      <GlassPanel className="p-0">
        <ApprovalTable />
      </GlassPanel>
    </div>
  );
}
