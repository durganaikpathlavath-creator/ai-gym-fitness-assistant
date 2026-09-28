"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/api/config";

type Profile = {
  name: string;
  email: string;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: string | null;
  activity_level: string | null;
  dietary_preference: string | null;
};

export default function Dashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load profile");
        }

        setProfile(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unable to load profile data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Loading Clinical Telemetry & Profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-slate-950 p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-slate-900/80 p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950 text-xl border border-red-800">
            ⚠️
          </div>
          <h2 className="mt-4 text-xl font-bold text-red-400">Authentication / Server Notice</h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400"
            >
              Sign In Again
            </button>
            <button
              onClick={() => setError("")}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      </main>
    );
  }

  const actionModules = [
    {
      title: "Live Rehab & Form Coach",
      subtitle: "Webcam ROM & Pose Analysis",
      desc: "Measure joint flexion/extension angles, detect knee valgus, and verify rep completion in real-time.",
      href: "/workout",
      icon: "🩺",
      badge: "Vision AI",
      color: "from-emerald-500/20 to-teal-500/10 border-teal-500/30",
    },
    {
      title: "Rehabilitation Protocols",
      subtitle: "Therapeutic Routines & Planner",
      desc: "Follow structured clinical recovery and mobility programs tailored to joints and recovery goals.",
      href: "/planner",
      icon: "📋",
      badge: "Protocols",
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    },
    {
      title: "Anti-Inflammatory Nutrition",
      subtitle: "Cellular & Muscular Repair",
      desc: "Personalized recovery diets, micronutrient ratios, and automated grocery lists.",
      href: "/nutrition",
      icon: "🥑",
      badge: "Clinical Diet",
      color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
    },
    {
      title: "Mobility & ROM Analytics",
      subtitle: "Joint Excursion Distributions",
      desc: "Review stability scores, cadence symmetry, and range-of-motion progress over time.",
      href: "/analytics",
      icon: "📈",
      badge: "Biomechanics",
      color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30",
    },
    {
      title: "PhysioBuddy 24/7 AI",
      subtitle: "Conversational Recovery Coach",
      desc: "Ask questions on soreness, form cues, tissue healing timelines, and exercise pacing.",
      href: "/buddy",
      icon: "🤖",
      badge: "AI Companion",
      color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30",
    },
    {
      title: "Clinical Progress Reports",
      subtitle: "Printable Telemetry Summaries",
      desc: "Generate comprehensive weekly rehabilitation summaries and performance charts.",
      href: "/reports",
      icon: "📑",
      badge: "Documentation",
      color: "from-slate-700/30 to-slate-800/20 border-slate-700/50",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Patient & Athlete Care Portal
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-teal-300">{profile?.name || "Trainee"}</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              AI_GYM_FITNESS & ASSISTANT (PhysioRecover AI) • Biomechanics & Joint Rehabilitation Hub
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/workout"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20 hover:from-emerald-400 hover:to-teal-400 transition"
            >
              <span>🩺</span>
              <span>Launch Live Rehab Coach</span>
            </Link>
            <Link
              href="/profile"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Telemetry & Profile Overview Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Rehabilitation Goal</span>
              <span className="text-base">🎯</span>
            </div>
            <p className="mt-2 text-xl font-bold capitalize text-white">
              {profile?.fitness_goal || "Mobility & Strength"}
            </p>
            <p className="mt-1 text-[11px] text-teal-400">Active Recovery Plan</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Biometric Specs</span>
              <span className="text-base">⚖️</span>
            </div>
            <p className="mt-2 text-xl font-bold text-white">
              {profile?.weight_kg ? `${profile.weight_kg} kg` : "72 kg"} • {profile?.height_cm ? `${profile.height_cm} cm` : "175 cm"}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Activity: {profile?.activity_level || "Moderate"}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Joint Range</span>
              <span className="text-base">📐</span>
            </div>
            <p className="mt-2 text-xl font-bold text-teal-300">105° - 175°</p>
            <p className="mt-1 text-[11px] text-slate-400">Functional Excursion Range</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Dietary Protocol</span>
              <span className="text-base">🥑</span>
            </div>
            <p className="mt-2 text-xl font-bold capitalize text-white">
              {profile?.dietary_preference || "Standard Anti-Inflammatory"}
            </p>
            <p className="mt-1 text-[11px] text-emerald-400">Tissue Repair Optimized</p>
          </div>
        </div>

        {/* Live Vision Coach Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                MediaPipe 33-Keypoint Engine Ready
              </span>
              <h2 className="text-2xl font-bold text-white">
                Markerless Joint Biomechanics & Form Coaching
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Step in front of your webcam to monitor knee and elbow angles, check valgus drift,
                and receive immediate audio/visual feedback without wearable sensors or calibration hardware.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/workout"
                className="rounded-xl bg-teal-400 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-md hover:bg-teal-300 transition"
              >
                Start Live Assessment →
              </Link>
              <Link
                href="/history"
                className="rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
              >
                Past Sessions
              </Link>
            </div>
          </div>
        </div>

        {/* Core Clinical Modules Grid */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Clinical & Recovery Modules</h3>
            <p className="text-xs text-slate-400">Select a tool to monitor, plan, or review rehabilitation progress</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actionModules.map((mod, idx) => (
              <Link
                key={idx}
                href={mod.href}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-b ${mod.color} p-6 backdrop-blur-sm hover:scale-[1.01] hover:border-teal-400/60 transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{mod.icon}</span>
                    <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-teal-300 border border-slate-700">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="mt-4 text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-[11px] font-medium text-teal-400/80">{mod.subtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {mod.desc}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
