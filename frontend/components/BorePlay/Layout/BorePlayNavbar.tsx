import Link from "next/link";

export default function BorePlayNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide"
        >
          BORE PLAY
        </Link>

        <span className="text-sm text-muted-foreground">
          Interactive Developer Workspace
        </span>
      </div>
    </header>
  );
}