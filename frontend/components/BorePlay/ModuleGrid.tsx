import ModuleCard from "./ModuleCard";
import { modules } from "./moduleData";

export default function ModuleGrid() {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Available Modules
        </h2>

        <p className="mt-2 text-muted-foreground">
          Launch a tool and start exploring.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard
            key={module.title}
            {...module}
          />
        ))}
      </div>
    </section>
  );
}