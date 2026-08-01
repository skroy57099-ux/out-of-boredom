export default function FraudContent() {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <h2 className="text-2xl font-bold text-white">
          Why Fraud Detection is Challenging
        </h2>

        <p className="mt-4 text-zinc-300 leading-8">
          Financial fraud detection presents a unique machine learning challenge
          because fraudulent transactions represent only a tiny fraction of the
          overall dataset. A model can achieve extremely high accuracy simply by
          predicting every transaction as legitimate, making accuracy an
          unreliable evaluation metric.
        </p>

        <p className="mt-4 text-zinc-300 leading-8">
          To address this imbalance, this project compares multiple machine
          learning algorithms using probability-based predictions, decision
          threshold tuning, and ROC-AUC evaluation. The entire workflow was
          built using a reusable preprocessing pipeline to ensure consistent and
          leakage-free model evaluation.
        </p>
      </div>
    </section>
  );
}
