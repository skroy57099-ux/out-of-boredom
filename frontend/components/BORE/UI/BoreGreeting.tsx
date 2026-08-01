import BoreStatus from "./BoreStatus";
interface BoreGreetingProps {
  creator?: boolean;
}

const creatorGreetings = [
  "You're back. I assumed you were chasing another impossible idea.",
];

const visitorGreetings = [
  "I'm BORE. The resident intelligence of Out of Boredom. Apparently we're building something today.",
];

export default function BoreGreeting({
  creator = false,
}: BoreGreetingProps) {
  const message = creator
    ? creatorGreetings[0]
    : visitorGreetings[0];

  return (
    <div
      className="
        border-b
        border-slate-800
        bg-slate-900
        px-5
        py-5
      "
    >
      <div className="flex gap-4">
        <div className="text-3xl">😮‍💨</div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                {creator ? "Creator." : "BORE"}
              </h2>

              <p className="text-sm text-cyan-400">
                Resident Intelligence
              </p>
            </div>

            <BoreStatus />
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
