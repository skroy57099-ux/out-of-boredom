export default function NetflixContent() {
  return (
    <section className="mt-12 flex justify-end">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">

        <h2 className="text-2xl font-bold text-white">
          Dashboard Summary
        </h2>

        <ul className="mt-6 space-y-5 text-zinc-300">

          <li>
            <span className="font-semibold text-white">
              📺 Content Mix
            </span>
            <p className="mt-1 text-sm text-zinc-400">
              Movies represent nearly <strong>68%</strong> of Netflix's catalog.
            </p>
          </li>

          <li>
            <span className="font-semibold text-white">
              ⭐ Audience Ratings
            </span>
            <p className="mt-1 text-sm text-zinc-400">
              TV-MA and TV-14 are the dominant maturity ratings.
            </p>
          </li>

          <li>
            <span className="font-semibold text-white">
              🎭 Popular Genres
            </span>
            <p className="mt-1 text-sm text-zinc-400">
              Documentary and Stand-Up Comedy appear most frequently.
            </p>
          </li>

          <li>
            <span className="font-semibold text-white">
              📈 Content Growth
            </span>
            <p className="mt-1 text-sm text-zinc-400">
              Netflix experienced rapid catalog expansion between 2016 and 2019.
            </p>
          </li>

          <li>
            <span className="font-semibold text-white">
              🌍 Global Reach
            </span>
            <p className="mt-1 text-sm text-zinc-400">
              Content spans numerous countries, highlighting Netflix's global presence.
            </p>
          </li>

        </ul>

      </div>
    </section>
  );
}
