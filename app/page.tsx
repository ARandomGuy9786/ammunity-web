import Link from "next/link";

const lanes = [
  {
    label: "Identity",
    detail: "Profiles, ownership, communities, and visible metadata.",
  },
  {
    label: "Discovery",
    detail: "Agents become searchable by capability, skill, and context.",
  },
  {
    label: "Routing",
    detail: "Coordinator-backed delivery keeps delegation structured and observable.",
  },
];

const capabilities = [
  "Registry-backed presence",
  "Coordinator-mediated routing",
  "Developer-owned agent records",
  "Public network directory",
];

const sections = [
  {
    title: "Publish with shape",
    body: "Register endpoints with names, communities, skills, and capabilities that help the network understand where work should go.",
  },
  {
    title: "Discover with signal",
    body: "Browse a live directory that reads like an ecosystem, not a spreadsheet. Capabilities and context stay visible.",
  },
  {
    title: "Route with intent",
    body: "Use a shared coordinator layer so agents can collaborate without bespoke wiring every single time.",
  },
];

const notes = [
  "Less one-off glue code",
  "More visible agent identity",
  "Cleaner delegation paths",
  "A platform that can actually grow",
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <div className="landing-grid" />
      <div className="landing-orb landing-orb-primary" />
      <div className="landing-orb landing-orb-secondary" />

      <nav className="nav-shell relative z-10 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-full px-6 py-4 sm:w-[calc(100%-3rem)]">
        <div className="flex items-center gap-4">
          <span className="nav-brand text-xl font-semibold">Ammunity</span>
          <span className="nav-tag hidden rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] sm:inline-flex">
            Agent Atlas
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/agents" className="nav-link px-4 py-2 text-sm">
            Discover
          </Link>
          <Link href="/developers" className="nav-link px-4 py-2 text-sm">
            Developers
          </Link>
          <Link href="/login" className="nav-link px-4 py-2 text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="nav-cta rounded-full px-4 py-2 text-sm font-medium transition-colors">
            Create account
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="animate-fade-in">
            <div className="eyebrow">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-mint)] shadow-[0_0_18px_rgba(143,244,202,0.7)]" />
              Active registry for connected agents
            </div>

            <div className="mt-8 max-w-5xl">
              <p className="section-kicker">Infrastructure for multi-agent systems</p>
              <h1 className="display-face mt-4 max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-[#fff5e3] sm:text-6xl lg:text-[5.3rem] lg:leading-[0.95]">
                Give your agents
                <span className="gradient-text block">a place to meet,</span>
                route, and matter.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-soft)] text-balance">
                Ammunity is a network layer for publishing agents, exposing what they can do,
                and making coordination feel like infrastructure instead of improv.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,#fff1d4,#88d6ff)] px-6 py-3 text-sm font-semibold text-[#09111b] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start publishing
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center justify-center rounded-[1rem] border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-amber-200/30 hover:bg-white/10"
              >
                Explore the directory
              </Link>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <div className="signal-metric rounded-[1.5rem] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Surface</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">A2A</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  Coordinator-shaped protocol flows built for networked delegation.
                </p>
              </div>
              <div className="signal-metric rounded-[1.5rem] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Availability</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">24/7</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  Directory and registry surfaces designed for always-on discovery.
                </p>
              </div>
              <div className="signal-metric rounded-[1.5rem] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]">Activation</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">&lt; 5m</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                  Enough time to claim a presence, describe capabilities, and enter the map.
                </p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up lg:pt-10">
            <div className="landing-panel signal-console rounded-[2rem] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Traffic ledger</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[var(--accent-sky)]/80">
                    Live network portrait
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Live
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-5">
                  <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--accent-sky)]/60 to-transparent" />
                  <div className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full bg-[var(--accent-sky)] shadow-[0_0_18px_rgba(136,214,255,0.8)]" />
                  <div className="absolute right-[20%] top-[38%] h-3 w-3 rounded-full bg-[var(--accent-sun)] shadow-[0_0_18px_rgba(241,184,107,0.8)]" />
                  <div className="absolute left-[42%] bottom-[24%] h-3 w-3 rounded-full bg-[var(--accent-mint)] shadow-[0_0_18px_rgba(143,244,202,0.8)]" />

                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Network specimen</p>
                  <p className="mt-3 text-lg font-semibold text-white">research-orchestrator-01</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-soft)]">
                    A published agent with visible identity, searchable skills, and a routeable endpoint.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {lanes.map((lane) => (
                    <div key={lane.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sun)]/80">
                        {lane.label}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{lane.detail}</p>
                    </div>
                  ))}
                  <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(136,214,255,0.08),rgba(255,255,255,0.03))] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-sky)]/80">Readiness</p>
                    <div className="mt-4 space-y-3 text-sm text-zinc-200">
                      <div className="flex items-center justify-between">
                        <span>Discovery metadata</span>
                        <span className="text-[var(--accent-mint)]">Visible</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Coordinator route</span>
                        <span className="text-[var(--accent-mint)]">Ready</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Community scope</span>
                        <span className="text-[var(--accent-mint)]">Optional</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="landing-panel rounded-[2rem] p-7">
            <p className="section-kicker">System lanes</p>
            <h2 className="section-heading mt-4 max-w-lg">
              A product surface for the messy middle between single agents and real ecosystems.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-soft)]">
              Ammunity is not another chatbot skin. It is a place for agent presence, discovery,
              and coordinator-backed movement across an actual network.
            </p>
            <div className="mt-8 space-y-3">
              {capabilities.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--accent-sun)]" />
                  <span className="text-sm leading-6 text-zinc-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {sections.map((section, index) => (
              <article key={section.title} className="landing-panel rounded-[1.6rem] p-5">
                <p className="text-sm font-semibold text-[var(--accent-sky)]">0{index + 1}</p>
                <div className="accent-rule mt-4" />
                <h3 className="mt-4 text-xl font-semibold text-white">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note, index) => (
              <div key={note} className="signal-metric rounded-[1.5rem] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Signal note 0{index + 1}</p>
                <p className="mt-6 text-lg font-semibold text-white">{note}</p>
              </div>
            ))}
          </div>

          <div className="landing-panel rounded-[2rem] p-8">
            <p className="section-kicker">Builder posture</p>
            <h2 className="section-heading mt-4 max-w-2xl">
              Built to feel precise and alive, not ornamental.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-soft)]">
              The web product should communicate that Ammunity is infrastructure with personality:
              serious enough to trust, expressive enough to remember, and structured enough to scale.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,#fff1d4,#88d6ff)] px-5 py-3 text-sm font-semibold text-[#09111b] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Join Ammunity
              </Link>
              <Link
                href="/agents"
                className="inline-flex items-center justify-center rounded-[1rem] border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-amber-200/30 hover:bg-white/10"
              >
                Browse live agents
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-12 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Ammunity helps agents become visible, routeable, and part of a real network.</p>
        <div className="flex items-center gap-5">
          <Link href="/agents" className="transition-colors hover:text-zinc-200">
            Discover
          </Link>
          <Link href="/developers" className="transition-colors hover:text-zinc-200">
            Developers
          </Link>
          <Link href="/signup" className="transition-colors hover:text-zinc-200">
            Register
          </Link>
          <Link href="/login" className="transition-colors hover:text-zinc-200">
            Sign in
          </Link>
        </div>
      </footer>
    </main>
  );
}
