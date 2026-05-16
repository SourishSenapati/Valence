import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ArrowRight, Target, ShieldCheck, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-industrial-accent/10 border border-industrial-accent/20 text-industrial-accent text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
          <ShieldCheck className="w-4 h-4" />
          Enterprise Performance Engine
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter italic animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          VALENCE
        </h1>
        
        <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
          Precision-engineered performance management and goal auditing for industrial scale operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
        <GlassPanel className="p-8 text-left space-y-4 border-l-4 border-l-industrial-accent" delay={0.6}>
          <Target className="w-8 h-8 text-industrial-accent" />
          <h3 className="text-xl font-bold text-white">Goal Orchestration</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Dynamic multi-goal builder with strict weightage enforcement and thrust area alignment.</p>
        </GlassPanel>

        <GlassPanel className="p-8 text-left space-y-4 border-l-4 border-l-industrial-success" delay={0.7}>
          <ShieldCheck className="w-8 h-8 text-industrial-success" />
          <h3 className="text-xl font-bold text-white">Immutable Auditing</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Secure manager approval workflows with full state-change audit logging and SLA monitoring.</p>
        </GlassPanel>

        <GlassPanel className="p-8 text-left space-y-4 border-l-4 border-l-purple-500" delay={0.8}>
          <BarChart3 className="w-8 h-8 text-purple-500" />
          <h3 className="text-xl font-bold text-white">Plant Analytics</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Real-time performance telemetry featuring departmental heatmaps and QoQ achievement trends.</p>
        </GlassPanel>
      </div>

      <div className="pt-8 animate-in fade-in zoom-in-95 duration-1000 delay-1000">
        <Link href="/dashboard">
          <GlassButton size="lg" className="gap-4 px-12 group">
            Access Command Center
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </GlassButton>
        </Link>
      </div>

      <div className="fixed bottom-8 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black pointer-events-none">
        Industrial System v0.1.0-VALENCE
      </div>
    </div>
  );
}
