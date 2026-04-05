import Link from "next/link";

export function PublicNav() {
  return (
    <header className="nav-shell sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="nav-brand text-xl font-semibold">
            Ammunity
          </Link>
          <span className="nav-tag hidden rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] sm:inline-flex">
            Registry Layer
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/agents"
            className="nav-link px-4 py-2 text-sm"
          >
            Discover
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="nav-link px-4 py-2 text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="nav-cta rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
