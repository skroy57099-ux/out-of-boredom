import { Project } from "./types";
import NetflixContent from "./content/NetflixContent";
export const projects: Project[] = [
  {
    id: "yolov8",

    title: "YOLOv8 Road Damage Detection",

    icon: "🕳️",

    shortDescription:
      "Deep learning system for automatic pothole and road damage detection using YOLOv8.",

    longDescription:
      "A computer vision project that detects potholes and road damages from real-world images using YOLOv8. Built using the RDD2022 dataset and optimized to reduce false positives.",

    category: "Artificial Intelligence",

    technologies: [
      "Python",
      "YOLOv8",
      "OpenCV",
      "PyTorch",
      "Ultralytics",
    ],

    featured: true,

    status: "Completed",

    github: "https://github.com/skroy57099-ux/Real-world_pothole_detection_yolov8",

    route: "/projects/yolov8",

    demo: "/projects/yolov8/videos/yolov8-demo.mp4",

    stats: [
      {
        label: "Dataset",
        value: "RDD2022",
      },
      {
        label: "Model",
        value: "YOLOv8n",
      },
      {
        label: "Focus",
        value: "Road Damage",
      },
      {
        label: "Framework",
        value: "PyTorch",
      },
      {
        label: "Goal",
        value: "Reduce False Positives",
      },
      {
        label: "Status",
        value: "Completed",
      },
    ],

    gallery: [
      {
        image: "/projects/yolov8/Chandigarh_conf025_vs_05_01.jpg",
        title: "Chandigarh Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Chandigarh_conf025_vs_05_02.jpg",
        title: "Chandigarh Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Chennai_conf025_vs_05_01.jpg",
        title: "Chennai Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Chennai_conf025_vs_05_02.jpg",
        title: "Chennai Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Patna_conf025_vs_05_01.jpg",
        title: "Patna Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Patna_conf025_vs_05_02.jpg",
        title: "Patna Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Vijayawada_conf025_vs_05_01.jpg",
        title: "Vijayawada Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
      {
        image: "/projects/yolov8/Vijayawada_conf025_vs_05_02.jpg",
        title: "Vijayawada Road Analysis",
        subtitle: "Confidence Threshold Comparison (0.25 vs 0.50)",
      },
    ],

  },
{
  id: "blinkit",

  title: "Blinkit Retail Analytics Pipeline",

  icon: "🛒",

  shortDescription:
    "End-to-end retail analytics pipeline using SQL Server, Python, and Power BI.",

  longDescription:
    "Designed and implemented a complete retail analytics workflow that integrates SQL Server, Python, and Power BI. The project includes data preprocessing, exploratory data analysis, statistical testing, interactive dashboard development, and business insight generation.",

  category: "Data Analytics",

  technologies: [
    "SQL Server",
    "Python",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Power BI",
  ],

  featured: true,

  status: "Completed",

  github:
    "https://github.com/skroy57099-ux/Blinkit-Retail-Analytics-Pipeline-SQL-to-Python-Power-BI-Dashboards-and-Insight-Reporting",

  route: "/projects/blinkit",

  stats: [
    {
      label: "Dataset",
      value: "8,523 Records",
    },
    {
      label: "Revenue",
      value: "$1.20M",
    },
    {
      label: "Avg Sales",
      value: "$141",
    },
    {
      label: "Tools",
      value: "SQL + Python + BI",
    },
    {
      label: "Dashboard",
      value: "Interactive",
    },
    {
      label: "Status",
      value: "Completed",
    },
  ],

  gallery: [
    {
      image: "/projects/blinkit/hero.png",
      title: "Project Workflow",
      subtitle:
        "Complete retail analytics pipeline from SQL Server to Power BI.",
    },
    {
      image: "/projects/blinkit/dashboard.png",
      title: "Interactive Dashboard",
      subtitle:
        "Retail KPIs, outlet performance, product analysis and sales insights.",
    },
  ]
},
{
  id: "netflix",

  title: "Netflix Content Analytics Dashboard",

  icon: "🎬",

  shortDescription:
    "Interactive Tableau dashboard analyzing Netflix's global content catalog through audience ratings, genres, geographic distribution, and historical content trends.",

  longDescription:
    "Designed an interactive Tableau dashboard using the Netflix Titles CSV dataset to explore Netflix's content library. The dashboard provides insights into content distribution, ratings, genres, countries, and yearly growth through interactive visualizations.",

  category: "Business Intelligence",

  technologies: [
    "Tableau",
    "Data Visualization",
    "Dashboard Design",
    "CSV",
  ],

  featured: true,

  status: "Completed",

  github: "https://github.com/skroy57099-ux/Netflix-Data-Analysis-Tableau-Dashbord",

  route: "/projects/netflix",

  stats: [
    {
      label: "Dataset",
      value: "6,234 Titles",
    },
    {
      label: "Visualizations",
      value: "6",
    },
    {
      label: "Platform",
      value: "Tableau",
    },
    {
      label: "Status",
      value: "Completed",
    },
  ],

  gallery: [
    {
      image: "/projects/netflix/hero.png",
      title: "Interactive Dashboard",
      subtitle:
        "Tableau dashboard exploring Netflix's content library through interactive visualizations and filters.",
    },
    {
    image: "/projects/netflix/dashboard-summary.png",
    title: "Dashboard Summary",
    subtitle: "Key business insights extracted from the dashboard."
  }
  ],
},
{
  id: "fraud",

  title: "Multi-Model Financial Fraud Detection",

  icon: "💳",

  shortDescription:
    "Machine learning pipeline for detecting fraudulent financial transactions using multiple classification algorithms.",

  longDescription:
    "Developed an end-to-end fraud detection system using Logistic Regression, Random Forest, and Gradient Boosting. The project focuses on highly imbalanced financial transaction data, utilizing probability-based predictions, threshold tuning, and ROC-AUC evaluation for reliable model comparison.",

  category: "Machine Learning",

  technologies: [
    "Python",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Matplotlib",
    "Jupyter Notebook",
    "Machine Learning",
  ],

  featured: true,

  status: "Completed",

  github:
    "https://github.com/skroy57099-ux/Multi-Model-Fraud-Detection-System-Using-Machine-Learning",

  route: "/projects/fraud",

  stats: [
    {
      label: "Models",
      value: "3",
    },
    {
      label: "Metric",
      value: "ROC-AUC",
    },
    {
      label: "Pipeline",
      value: "End-to-End",
    },
    {
      label: "Focus",
      value: "Fraud Detection",
    },
  ],

  gallery: [
    {
    image: "/projects/fraud/hero.png",
    title: "Model Performance Comparison",
    subtitle:
      "ROC-AUC comparison of Logistic Regression, Random Forest, and Gradient Boosting models.",
  },
    {
      image: "/projects/fraud/correlation-matrix.png",
      title: "Feature Correlation Analysis",
      subtitle:
        "Correlation analysis performed during exploratory data analysis to understand relationships between transaction features.",
    },
    {
      image: "/projects/fraud/transaction-type.png",
      title: "Transaction Type Distribution",
      subtitle:
        "Distribution of financial transactions across different transaction categories.",
    },
    {
      image: "/projects/fraud/fraud-rate.png",
      title: "Fraud Rate by Transaction Type",
      subtitle:
        "Fraudulent transactions are primarily concentrated in TRANSFER and CASH_OUT transaction types.",
    },
  ],

  
},
{
  id: "ai-financial-analysis",
  title: "Financial Market Analysis of AI Companies using Python",
  icon: "📈",
  shortDescription:
    "Exploratory financial analysis of leading AI companies using Python to uncover trends in R&D investment, AI revenue, stock market impact, and major AI milestones.",

  longDescription:
    "Analyzed financial and market performance data of major AI companies through exploratory data analysis and visualization. The project examines research spending, AI-generated revenue, stock market reactions, company growth, and the influence of significant AI events using Python.",

  category: "Data Analytics",

  technologies: [
    "Python",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Jupyter Notebook",
    "Exploratory Data Analysis",
  ],

  featured: true,

  status: "Completed",

  github: "https://github.com/skroy57099-ux/Analyse-Financial-Market-Data-of-AI-companies-with-Python",

  route: "/projects/ai-financial-analysis",

  stats: [
    {
      label: "Companies",
      value: "3",
    },
    {
      label: "Years Covered",
      value: "2015-2024",
    },
    {
      label: "Insights",
      value: "9",
    },
    {
      label: "Analysis",
      value: "EDA",
    },
  ],

  gallery: [
    {
      image: "/projects/ai-financial-analysis/hero.png",
      title: "Expenditure vs Revenue",
      subtitle:
        "Comparison of yearly R&D expenditure and AI-generated revenue across leading AI companies.",
    },
    {
      image: "/projects/ai-financial-analysis/rd-spending.png",
      title: "Research & Development Spending",
      subtitle:
        "Comparison of R&D investment made by Google, Meta, and OpenAI.",
    },
    {
      image: "/projects/ai-financial-analysis/ai-revenue.png",
      title: "AI Revenue Comparison",
      subtitle:
        "Comparison of AI-generated revenue across the analyzed companies.",
    },
    {
      image: "/projects/ai-financial-analysis/ai-revenue-growth.png",
      title: "AI Revenue Growth",
      subtitle:
        "Growth trend of AI revenue among major AI organizations.",
    },
    {
      image: "/projects/ai-financial-analysis/correlation-heatmap.png",
      title: "Correlation Heatmap",
      subtitle:
        "Correlation analysis highlighting relationships between financial and market variables.",
    },
    {
      image: "/projects/ai-financial-analysis/stock-impact-timeline.png",
      title: "Date-wise Stock Impact",
      subtitle:
        "Timeline showing fluctuations in stock impact over the analysis period.",
    },
    {
      image: "/projects/ai-financial-analysis/max-stock-impact-events.png",
      title: "Maximum Stock Impact Events",
      subtitle:
        "Major AI milestones associated with significant stock market reactions.",
    },
    {
      image: "/projects/ai-financial-analysis/event-impact-analysis.png",
      title: "Event Impact Analysis",
      subtitle:
        "Comparison of financial metrics and stock impact across major AI-related events.",
    },
    {
      image: "/projects/ai-financial-analysis/stock-change-by-company-year.png",
      title: "Stock Change by Company & Year",
      subtitle:
        "Year-wise comparison of stock index changes across different AI companies.",
    },
  ],
},
{
  id: "github-showcase",
  title: "GitHub Showcase",
  icon: "💻",

  shortDescription:
    "Explore additional repositories featuring machine learning, NLP, computer vision, data engineering, and analytics projects.",

  longDescription:
    "A curated collection of additional GitHub repositories showcasing practical implementations across artificial intelligence, data analytics, natural language processing, data engineering, and business intelligence.",

  category: "Portfolio",

  technologies: [
    "Python",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Power BI",
    "Tableau",
    "Git",
  ],

  featured: false,

  status: "In Progress",


  github: "https://github.com/skroy57099-ux?tab=repositories",

  route: "/projects/github-showcase",

  stats: [
    {
      label: "Repositories",
      value: "10+",
    },
    {
      label: "Domains",
      value: "7",
    },
    {
      label: "Languages",
      value: "Python & SQL",
    },
    {
      label: "Open Source",
      value: "Public",
    },
  ],

  gallery: [],
},
];
export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function getProjectByTitle(title: string) {
  return projects.find(
    (project) =>
      project.title.toLowerCase() === title.toLowerCase()
  );
}

export function getProjectsByTechnology(technology: string) {
  return projects.filter((project) =>
    project.technologies.some(
      (tech) =>
        tech.toLowerCase() === technology.toLowerCase()
    )
  );
}
export function getProjectsByCategory(category: string) {
  return projects.filter(
    (project) =>
      project.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function searchProjects(query: string) {
  const q = query.toLowerCase();

  return projects.filter((project) => {
    return (
      project.title.toLowerCase().includes(q) ||
      project.shortDescription.toLowerCase().includes(q) ||
      project.longDescription.toLowerCase().includes(q) ||
      project.category.toLowerCase().includes(q) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(q)
      )
    );
  });
}