export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-2xl text-center">
        {/* BORE Status */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

            <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
              BORE SYSTEM
            </span>

            <span className="text-xs text-slate-500">
              BUILDING
            </span>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          This playground is still under construction.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400">
          BORE is currently staring at the code and pretending everything
          is under control.
        </p>

        {/* Terminal-style status */}
        <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-2xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>

          <div className="space-y-2 font-mono text-sm">
            <p className="text-slate-500">
              $ bore status
            </p>

            <p className="text-cyan-400">
              &gt; Initializing playground...
            </p>

            <p className="text-yellow-400">
              &gt; Status: UNDER_CONSTRUCTION
            </p>

            <p className="text-slate-400">
              &gt; Developer: Shubham
            </p>

            <p className="text-slate-500">
              &gt; Estimated completion: whenever the developer stops adding
              new ideas.
            </p>

            <p className="pt-2 text-green-400">
              &gt; BORE says: Please come back later.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-slate-600">
          No bugs were harmed during construction.
          <br />
          Several were probably created.
        </p>
      </div>
    </main>
  );
}