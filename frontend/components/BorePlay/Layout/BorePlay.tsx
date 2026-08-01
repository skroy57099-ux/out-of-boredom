import BorePlayHero from "./BorePlayHero";
import BorePlayNavbar from "./BorePlayNavbar";
import ModuleGrid from "../ModuleGrid";

export default function BorePlay() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BorePlayNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <BorePlayHero />

        <div className="mt-12">
          <ModuleGrid />
        </div>
      </main>
    </div>
  );
}
