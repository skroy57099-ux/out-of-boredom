export default function BorePlayHero() {
  return (
    <section>

      {/* Hero */}

      <div className="max-w-4xl">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          BORE PLAY
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight lg:text-6xl">
          Interactive Developer Workspace
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Explore the tools instead of reading about them.
        </p>

      </div>

      {/* Workspace Status */}

      <div
        className="
          mt-10
          rounded-2xl
          border
          border-white/10
          bg-card
          px-8
          py-6
        "
      >

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}

          <div>

            <div className="flex items-center gap-3">

              <div className="relative">

                <span
                  className="
                    absolute
                    h-3
                    w-3
                    rounded-full
                    bg-green-500
                    opacity-50
                    animate-ping
                  "
                />

                <span
                  className="
                    relative
                    block
                    h-3
                    w-3
                    rounded-full
                    bg-green-500
                  "
                />

              </div>

              <h3 className="text-lg font-semibold">
                Workspace Ready
              </h3>

            </div>

            <p className="mt-4 max-w-lg text-sm leading-6 italic text-muted-foreground">
              "I keep an eye on this place while
              <br />
              Shubham keeps building things."
            </p>

          </div>

          {/* Right */}

          <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm sm:grid-cols-4">

            <div>

              <p className="text-muted-foreground">
                Modules
              </p>

              <p className="mt-1 text-lg font-semibold">
                8
              </p>

            </div>

            <div>

              <p className="text-muted-foreground">
                Version
              </p>

              <p className="mt-1 text-lg font-semibold">
                v1.0
              </p>

            </div>

            <div>

              <p className="text-muted-foreground">
                Status
              </p>

              <p className="mt-1 font-semibold text-green-400">
                Stable
              </p>

            </div>

            <div>

              <p className="text-muted-foreground">
                Updated
              </p>

              <p className="mt-1 font-semibold">
                Today
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
