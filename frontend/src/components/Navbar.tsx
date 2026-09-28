"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Live Rehab & Form", href: "/workout", icon: "🩺" },
    { label: "Protocols", href: "/planner", icon: "📋" },
    { label: "Recovery Diet", href: "/nutrition", icon: "🥑" },
    { label: "Mobility Analytics", href: "/analytics", icon: "📈" },
    { label: "Adherence", href: "/habit", icon: "📅" },
    { label: "PhysioBuddy", href: "/buddy", icon: "🤖" },
    { label: "Reports", href: "/reports", icon: "📑" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/60 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🩺</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                AI_GYM_FITNESS
              </span>
              <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-teal-300 border border-teal-500/30">
                PHYSIORECOVER AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Joint ROM & Physical Rehab Assistant
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  pathname === "/profile"
                    ? "bg-slate-800 text-teal-300"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                👤 Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium ${
                  pathname === link.href
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  👤 My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex w-full gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg border border-slate-700 py-2 text-xs font-medium text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg bg-teal-500 py-2 text-xs font-semibold text-slate-950"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
