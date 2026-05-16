"use client";

import { signIn } from "next-auth/react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/Forms";
import { ShieldCheck, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-industrial-950">
      <GlassPanel className="max-w-md w-full p-10 space-y-8" delay={0.1}>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-industrial-accent/10 border border-industrial-accent/20 text-industrial-accent mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">VALENCE ACCESS</h1>
          <p className="text-gray-500 text-sm font-medium">Authenticate to enter the command center.</p>
        </div>

        <div className="space-y-4">
          <GlassButton
            onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
            className="w-full justify-center gap-3 bg-white/5 hover:bg-white/10 border-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.444 0H0v11.444h11.444V0z" fill="#f25022"/><path d="M23 0H11.556v11.444H23V0z" fill="#7fbb00"/><path d="M11.444 11.556H0V23h11.444V11.556z" fill="#00a1f1"/><path d="M23 11.556H11.556V23H23V11.556z" fill="#ffb900"/></svg>
            Sign in with Microsoft
          </GlassButton>

          <GlassButton
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full justify-center gap-3 bg-white/5 hover:bg-white/10 border-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </GlassButton>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
            <span className="bg-industrial-950 px-4 text-gray-600">Or use magic link</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Work Email</label>
            <GlassInput
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <GlassButton
            type="submit"
            disabled={isLoading}
            className="w-full justify-center gap-3 bg-industrial-accent/10 border-industrial-accent/20 text-industrial-accent hover:bg-industrial-accent/20"
          >
            {isLoading ? "Sending..." : <><Mail className="w-4 h-4" /> Send Magic Link</>}
          </GlassButton>
        </form>

        <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest font-medium">
          Secure industrial gateway. Authorization required.
        </p>
      </GlassPanel>
    </div>
  );
}
