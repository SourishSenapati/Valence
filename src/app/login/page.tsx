"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Liquid Glass Login Card */}
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[40px] p-12 shadow-[0_0_80px_-20px_rgba(255,255,255,0.05)] border-t-white/20">
          <div className="text-center space-y-8 mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-black text-3xl italic">V</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                Valence
              </h1>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
                Enterprise Identity
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
              className="group relative w-full flex items-center justify-center gap-4 px-6 py-5 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <svg className="w-6 h-6" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Sign in with Microsoft</span>
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-700 text-[10px] font-bold uppercase tracking-[0.2em]">
                Single Sign-On
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>
            
            <p className="text-center text-[11px] text-gray-500 px-6 leading-relaxed">
              Securely sign in using your organization&apos;s Entra ID credentials. 
              Contact IT support if you encounter issues.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs">
            Powered by Valence Security Engine v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
