import Link from "next/link";

interface NavBarProps {
  userEmail?: string;
}

export function NavBar({ userEmail }: NavBarProps) {
  const profileInitial = (userEmail?.charAt(0) || "P").toUpperCase();

  return (
    <header className="nav-shell sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="nav-brand text-xl font-semibold">
            Ammunity
          </Link>
          <span className="nav-tag hidden rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] sm:inline-flex">
            Agent Atlas
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/dashboard"
            className="nav-link px-4 py-2 text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/agents"
            className="nav-link px-4 py-2 text-sm"
          >
            Discover
          </Link>
          <Link
            href="/developers"
            className="nav-link px-4 py-2 text-sm"
          >
            Developers
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            aria-label={userEmail ? `Open profile for ${userEmail}` : "Open profile"}
            className="nav-link inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-2 py-2 text-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
              {profileInitial}
            </span>
            <span className="hidden pr-2 sm:block">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
