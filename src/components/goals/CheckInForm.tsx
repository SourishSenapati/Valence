"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput, GlassSelect } from "@/components/ui/Forms";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { calculateAchievement } from "@/lib/engine";
import { Quarter, ProgressStatus, UomType } from "@prisma/client";
import { Loader2, RefreshCcw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckInForm() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>(Quarter.Q1);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/check-ins");
      const json = await res.json();
      setGoals(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    
    // Auto-detect active quarter based on month
    const month = new Date().getMonth();
    if (month === 6) setActiveQuarter(Quarter.Q1);
    else if (month === 9) setActiveQuarter(Quarter.Q2);
    else if (month === 0) setActiveQuarter(Quarter.Q3);
    else if (month === 2 || month === 3) setActiveQuarter(Quarter.Q4);
  }, []);

  const handleUpdate = async (goal: any, value: number, status: ProgressStatus) => {
    setSubmitting(goal.id);
    try {
      const res = await fetch("/api/check-ins", {
        method: "POST",
        body: JSON.stringify({
          goalId: goal.id,
          quarter: activeQuarter,
          actualAchievement: value,
          progressStatus: status,
        }),
      });

      if (res.ok) {
        fetchGoals();
      } else {
        const err = await res.json();
        alert(err.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500 uppercase tracking-widest font-bold animate-pulse">Syncing Targets...</div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
            <RefreshCcw className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight italic">Achievement Tracking</h2>
            <p className="text-gray-500 text-sm">Active Cycle: <span className="text-accent-blue font-bold tracking-widest uppercase">{activeQuarter} Check-in</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal) => {
          const currentCheckIn = goal.checkIns?.find((c: any) => c.quarter === activeQuarter);
          const achievement = calculateAchievement(
            goal.uomType, 
            goal.targetValue, 
            currentCheckIn?.actualAchievement ?? 0
          );

          return (
            <GlassPanel key={goal.id} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-4 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={goal.uomType} variant="info" />
                    <StatusBadge label={`Target: ${goal.targetValue}`} variant="neutral" />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span>Live Progress</span>
                      <span className={cn(
                        achievement >= 100 ? "text-accent-green" : "text-accent-blue"
                      )}>{achievement.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(14,165,233,0.3)]",
                          achievement >= 100 ? "bg-accent-green" : "bg-accent-blue"
                        )}
                        style={{ width: `${Math.min(achievement, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <GlassInput
                      type="number"
                      label="Actual Achievement"
                      defaultValue={currentCheckIn?.actualAchievement ?? 0}
                      onBlur={(e) => handleUpdate(goal, Number(e.target.value), currentCheckIn?.progressStatus ?? "ON_TRACK")}
                      className="text-lg font-bold"
                    />
                    <GlassSelect
                      label="Status Override"
                      defaultValue={currentCheckIn?.progressStatus ?? "NOT_STARTED"}
                      onChange={(e) => handleUpdate(goal, currentCheckIn?.actualAchievement ?? 0, e.target.value as ProgressStatus)}
                    >
                      {Object.values(ProgressStatus).map(s => (
                        <option key={s} value={s} className="bg-industrial-900">{s}</option>
                      ))}
                    </GlassSelect>
                  </div>
                </div>

                <div className="lg:col-span-3 flex justify-end">
                  {submitting === goal.id ? (
                    <div className="flex items-center gap-2 text-accent-blue animate-pulse font-black text-xs uppercase tracking-widest">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Pulse...
                    </div>
                  ) : currentCheckIn ? (
                    <div className="flex items-center gap-2 text-accent-green font-black text-xs uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4" />
                      Synced
                    </div>
                  ) : null}
                </div>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
