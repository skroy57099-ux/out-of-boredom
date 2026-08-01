export default function GithubShowcaseContent() {
  const repositoryGroups = [
    {
      category: "🧠 Machine Learning",
      repositories: [
        {
          title: "Signal Classification using ML & Deep Learning",
          description:
            "Hybrid machine learning and deep learning pipeline using FFT-based feature engineering and 1D CNNs for signal classification.",
        },
        {
          title: "Fake Listings Detection for E-commerce Platforms",
          description:
            "Machine learning solution for identifying fraudulent online product listings using structured metadata and behavioral features.",
        },
      ],
    },
    {
      category: "🤖 Natural Language Processing",
      repositories: [
        {
          title: "Conversational AI Chatbot using Transformers",
          description:
            "Interactive chatbot built with Microsoft's DialoGPT-medium for context-aware conversations.",
        },
        {
          title: "AI-Powered Text Summarization Tool",
          description:
            "Automatic text summarization using Hugging Face Transformers implemented in Python.",
        },
      ],
    },
    {
      category: "📊 Data Engineering & Analytics",
      repositories: [
        {
          title: "End-to-End E-commerce Analytics & Delivery Prediction",
          description:
            "Complete analytics pipeline combining SQL, Python, feature engineering, and machine learning.",
        },
        {
          title: "Python Airline Flight Data Analysis",
          description:
            "Exploratory data analysis and visualization of airline performance using Python.",
        },
        {
          title: "Sales Dashboard (Excel Analytics)",
          description:
            "Interactive Excel dashboard analyzing sales, profitability, customer satisfaction, and business performance.",
        },
      ],
    },
  ];

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Beyond the Featured Portfolio
        </h2>

        <p className="text-muted-foreground leading-7">
          This portfolio highlights a curated selection of my featured projects.
          My GitHub profile contains additional repositories demonstrating
          practical implementations across machine learning, natural language
          processing, data engineering, business intelligence, and exploratory
          data analysis.
        </p>
      </div>

      {repositoryGroups.map((group) => (
        <div key={group.category}>
          <h3 className="text-xl font-semibold mb-5">
            {group.category}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {group.repositories.map((repo) => (
              <div
                key={repo.title}
                className="rounded-xl border bg-card p-5 transition-all hover:shadow-md"
              >
                <h4 className="font-semibold text-lg">
                  {repo.title}
                </h4>

                <p className="mt-2 text-sm text-muted-foreground leading-6">
                  {repo.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl border bg-muted/40 p-8 text-center">
        <h3 className="text-2xl font-bold">
          Explore Even More
        </h3>

        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          My GitHub profile includes additional repositories covering AI,
          analytics, automation, experiments, and ongoing learning projects,
          complete with source code, notebooks, and documentation.
        </p>

        <a
          href="https://github.com/skroy57099-ux"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-6 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium transition hover:opacity-90"
        >
          View Complete GitHub Profile →
        </a>
      </div>
    </section>
  );
}
