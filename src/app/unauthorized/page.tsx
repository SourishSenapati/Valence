import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Orbs for Liquid Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Liquid Glass Container */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-[32px] p-12 shadow-2xl overflow-hidden group">
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-20 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-500/20 to-orange-500/20 border border-red-500/30 mb-4">
              <svg 
                className="w-10 h-10 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-11a4 4 0 11-8 0 4 4 0 018 0zM7 10a5 5 0 0110 0v4a5 5 0 01-10 0v-4z" />
              </svg>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Access Denied
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-[280px] mx-auto">
                Your role does not have permission to view this restricted area.
              </p>
            </div>

            <div className="pt-8">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 backdrop-blur-md"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Blur Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}
