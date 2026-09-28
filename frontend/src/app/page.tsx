import Link from "next/link";

export default function Home() {
  const coreFeatures = [
    {
      title: "Real-Time Joint ROM & Pose Analysis",
      badge: "Computer Vision",
      icon: "🩺",
      desc: "Markerless 33-point biomechanical tracking powered by MediaPipe. Computes real-time flexion, extension, and angular excursion to restore full range of motion.",
    },
    {
      title: "Clinical Injury Prevention & Valgus Alerts",
      badge: "Safety Biomechanics",
      icon: "🛡️",
      desc: "Instant safety cues for knee valgus, rapid eccentric drops, asymmetric loading, and spinal hyperextension during rehabilitation movements.",
    },
    {
      title: "Targeted Rehabilitation Protocols",
      badge: "Physiotherapy",
      icon: "📋",
      desc: "Guided therapeutic regimens for Lower Limb, Knee Stability, Rotator Cuff, and Scapular re-education with progressive cadence controls.",
    },
    {
      title: "Anti-Inflammatory & Recovery Nutrition",
      badge: "Clinical Dietetics",
      icon: "🥑",
      desc: "Nutritional planning targeting cellular repair, collagen synthesis, and systemic inflammation reduction to accelerate muscular recovery.",
    },
    {
      title: "PhysioBuddy 24/7 AI Assistant",
      badge: "Contextual AI",
      icon: "🤖",
      desc: "Adaptive assistant for soreness evaluation, movement pacing, recovery streak milestones, and evidence-based physical therapy coaching.",
    },
    {
      title: "Mobility & Adherence Telemetry",
      badge: "Analytics",
      icon: "📈",
      desc: "Longitudinal tracking of joint excursion, rep smoothness, cadence consistency, and clinical session compliance charts.",
    },
  ];

  const exerciseProtocols = [
    {
      name: "Squat Rehab & Mobility",
      joint: "Knee & Hip",
      target: "105° Functional Depth",
      focus: "Patellar tracking & knee valgus prevention",
    },
    {
      name: "Knee Extension Recovery",
      joint: "Tibiofemoral Joint",
      target: "Terminal Extension (170°-180°)",
      focus: "VMO quad activation & joint excursion",
    },
    {
      name: "Bicep Flexion & Elbow Rehab",
      joint: "Elbow Joint",
      target: "65° - 145° Excursion",
      focus: "Tendon resilience & controlled eccentric return",
    },
    {
      name: "Shoulder Press & Mobility",
      joint: "Glenohumeral & Scapula",
      target: "Overhead Excursion",
      focus: "Scapular upward rotation & rotator cuff health",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Author & Concept Ribbon */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-4 py-1.5 text-xs font-semibold text-teal-300 shadow-inner mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI_GYM_FITNESS & ASSISTANT</span>
            <span className="text-teal-600">•</span>
            <span className="text-emerald-400 font-bold">PHYSIORECOVER AI</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Intelligent Physical Therapy &{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Joint Biomechanics
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-300">
            A state-of-the-art computer vision platform designed for clinical physical rehabilitation,
            joint range-of-motion assessment, real-time injury risk prevention, and personalized fitness recovery.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/workout"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-teal-500/25 hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.02] transition-all"
            >
              <span>🩺</span>
              <span>Launch Live Rehab Coach</span>
            </Link>

            <Link
              href="/planner"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all backdrop-blur-sm"
            >
              <span>📋</span>
              <span>Therapy Protocols</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-950/20 px-6 py-3.5 text-sm font-semibold text-teal-300 hover:bg-teal-950/40 transition-all"
            >
              <span>📊</span>
              <span>Patient Dashboard</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-y border-slate-800/80 bg-slate-900/30 py-6 sm:grid-cols-4 rounded-2xl backdrop-blur-sm">
            <div>
              <p className="text-2xl font-bold text-teal-400">33 Points</p>
              <p className="text-xs text-slate-400">Markerless Pose Tracking</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">&lt; 15 ms</p>
              <p className="text-xs text-slate-400">In-Browser CV Latency</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">100% Client-Side</p>
              <p className="text-xs text-slate-400">Webcam Privacy Preserved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-400">P. Durga Naik</p>
              <p className="text-xs text-slate-400">Lead Project Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Clinical & Biomechanical Architecture
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Designed for Rehabilitation & Performance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-teal-500/40 hover:bg-slate-900/80 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-2xl border border-teal-500/20 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-teal-300 border border-slate-700">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Rehabilitation Protocols */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Validated Movement Modules
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                Active Joint Rehabilitation Protocols
              </h3>
            </div>
            <Link
              href="/workout"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300"
            >
              <span>Test with your webcam</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exerciseProtocols.map((proto, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-teal-500/50 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-teal-400 font-semibold mb-2">
                  <span>{proto.joint}</span>
                  <span className="rounded bg-teal-500/10 px-2 py-0.5 border border-teal-500/20">Active</span>
                </div>
                <h4 className="text-base font-bold text-white">{proto.name}</h4>
                <p className="text-xs text-slate-400 mt-1"><strong className="text-slate-300">Target:</strong> {proto.target}</p>
                <p className="text-xs text-slate-400 mt-1"><strong className="text-slate-300">Focus:</strong> {proto.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Attribution */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-bold">AI_GYM_FITNESS & ASSISTANT</span>
            <span>• PhysioRecover AI Edition</span>
          </div>
          <div>
            Developed & Engineered by <span className="font-semibold text-slate-300">P. Durga Naik</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/workout" className="hover:text-teal-300">Live Rehab</Link>
            <Link href="/nutrition" className="hover:text-teal-300">Nutrition</Link>
            <Link href="/planner" className="hover:text-teal-300">Protocols</Link>
            <Link href="/reports" className="hover:text-teal-300">Reports</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}