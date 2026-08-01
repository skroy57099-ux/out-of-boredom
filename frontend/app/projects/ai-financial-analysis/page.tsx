import { notFound } from "next/navigation";
import { projects } from "@/components/Projects/projects";
import ProjectLayout from "@/components/Projects/ProjectLayout";
import AIFinancialAnalysisContent from "@/components/Projects/content/AIFinancialAnalysisContent";

export default function AIFinancialAnalysisPage() {
  const project = projects.find(
    (p) => p.id === "ai-financial-analysis"
  );

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout project={project}>
      <AIFinancialAnalysisContent />
    </ProjectLayout>
  );
}
