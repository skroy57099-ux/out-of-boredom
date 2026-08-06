import SQLHero from "@/components/BorePlay/SQLPlayground/Layout/SQLHero";
import SQLWorkspace from "@/components/BorePlay/SQLPlayground/Playground/SQLWorkspace";

export default function SQLPlaygroundPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <SQLHero />

        <SQLWorkspace />

      </div>
    </main>
  );
}