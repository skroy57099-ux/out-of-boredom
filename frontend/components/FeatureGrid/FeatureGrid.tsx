import FeatureCard from "../Cards/FeatureCard";

export default function FeatureGrid() {
  return (
    <section className="mt-20 grid gap-6 px-8 md:grid-cols-2 lg:grid-cols-3">

      <FeatureCard
        icon="📄"
        title="Resume Lab"
        description="ATS Analysis, Resume Review & Job Match"
      />

      <FeatureCard
        icon="📊"
        title="CSV Lab"
        description="EDA, Charts & AI Insights"
      />

      <FeatureCard
        icon="📈"
        title="Dashboard Lab"
        description="Interactive BI Dashboards"
      />

      <FeatureCard
        icon="🧹"
        title="Data Cleaning"
        description="Missing Values, Validation & Fixes"
      />

      <FeatureCard
        icon="💬"
        title="AI Chat"
        description="Talk with BORE"
      />

      <FeatureCard
        icon="🗄"
        title="SQL Playground"
        description="Practice & Learn SQL"
      />

    </section>
  );
}
