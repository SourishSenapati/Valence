"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Download, Loader2 } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

export function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    window.open("/api/export", "_blank");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-industrial-accent" />
      <p className="text-gray-500 font-bold uppercase tracking-widest">Synthesizing Enterprise Data...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight italic">Intelligence Dashboard</h1>
          <p className="text-gray-400 mt-2">Enterprise-wide performance telemetry and goal distribution.</p>
        </div>
        <GlassButton onClick={handleExport} className="gap-2 border-industrial-accent/20 text-industrial-accent hover:bg-industrial-accent/10">
          <Download className="w-4 h-4" />
          Export Governance Report
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassPanel className="p-8" delay={0.1}>
          <h3 className="text-lg font-bold text-white mb-8">Status Distribution by Department</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.deptDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="department" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                />
                <Legend />
                <Bar dataKey="COMPLETED" fill="#10b981" stackId="a" />
                <Bar dataKey="ON_TRACK" fill="#38bdf8" stackId="a" />
                <Bar dataKey="NOT_STARTED" fill="#404040" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-8" delay={0.2}>
          <h3 className="text-lg font-bold text-white mb-8">Quarterly Achievement Trends (QoQ)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.qoqAchievement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="quarter" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                />
                <Line type="monotone" dataKey="achievement" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6, fill: "#38bdf8" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
