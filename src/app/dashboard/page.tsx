import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GoalStatus } from "@prisma/client";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const goals = await db.goal.findMany({
    where: {
      employeeId: session?.user?.id,
    },
    orderBy: {
      id: "desc",
    },
  });

  const getStatusVariant = (status: GoalStatus) => {
    switch (status) {
      case "APPROVED": return "success";
      case "PENDING": return "warning";
      case "REJECTED": return "error";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight italic">Operations Hub</h1>
          <p className="text-gray-400 mt-2">Welcome back, {session?.user?.name}. Here is your current performance snapshot.</p>
        </div>
        <Link href="/dashboard/goals/new">
          <GlassButton className="gap-2">
            <Target className="w-4 h-4" />
            Set New Goals
          </GlassButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="p-6 border-l-4 border-l-accent-blue">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Active Goals</p>
          <p className="text-3xl font-black">{goals.length}</p>
        </GlassPanel>
        <GlassPanel className="p-6 border-l-4 border-l-accent-orange">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pending Approval</p>
          <p className="text-3xl font-black">{goals.filter((g: any) => g.status === "PENDING").length}</p>
        </GlassPanel>
        <GlassPanel className="p-6 border-l-4 border-l-accent-green">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Weightage</p>
          <p className="text-3xl font-black">{goals.reduce((acc: number, curr: any) => acc + curr.weightage, 0)}%</p>
        </GlassPanel>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-blue" />
          Goal Repository
        </h2>
        
        {goals.length === 0 ? (
          <GlassPanel className="p-12 text-center space-y-4">
            <p className="text-gray-500">No goals found in your repository.</p>
            <Link href="/dashboard/goals/new" className="inline-block">
              <GlassButton variant="secondary">Start Your Goal Sheet</GlassButton>
            </Link>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {goals.map((goal: any) => (
              <GlassPanel key={goal.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 group-hover:text-white group-hover:border-white/20 transition-all">
                    {goal.weightage}%
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{goal.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{goal.thrustArea}</span>
                      <div className="w-1 h-1 rounded-full bg-gray-700" />
                      <span className="text-xs text-gray-500 font-medium">{goal.uomType}: {goal.targetValue}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <StatusBadge label={goal.status} variant={getStatusVariant(goal.status)} />
                  <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-accent-blue transition-colors" />
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
