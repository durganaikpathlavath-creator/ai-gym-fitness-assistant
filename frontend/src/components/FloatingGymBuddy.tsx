"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FloatingGymBuddy() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  // Don't render on auth pages or when already on buddy page
  if (pathname === "/login" || pathname === "/register" || pathname === "/buddy") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.push(isAuthenticated ? "/buddy" : "/login?redirect=/buddy")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-teal-500/50 bg-slate-950/90 px-4 py-3 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-900 hover:border-teal-400 group"
      title="Ask PhysioBuddy AI Assistant"
      aria-label="Ask PhysioBuddy AI Assistant"
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-lg shadow-md">
        🩺
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
      </div>
      <div className="flex flex-col text-left hidden sm:flex">
        <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
          PhysioBuddy
        </span>
        <span className="text-[10px] text-teal-400 font-medium">
          Rehab & Form AI
        </span>
      </div>
    </button>
  );
}
