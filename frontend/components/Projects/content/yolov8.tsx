import {
  Target,
  Database,
  Cpu,
  BarChart3,
  Rocket,
} from "lucide-react";

import { Project } from "../types";

type Props = {
  project: Project;
};

export default function YoloContent({ project }: Props) {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10">

        {/* Heading */}

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white">
            Technical Overview
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-zinc-400">
            This project demonstrates an end-to-end computer vision pipeline
            for automated pothole detection using YOLOv8. It covers dataset
            preparation, annotation conversion, model training, inference,
            confidence threshold tuning and qualitative evaluation on
            real-world Indian road videos.
          </p>
        </div>

        {/* Objectives */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Target className="text-blue-400" size={20} />
            Objectives
          </h3>

          <ul className="space-y-3 text-zinc-300">
            <li>• Build a reliable pothole detection model using YOLOv8.</li>
            <li>• Convert RDD2022 XML annotations into YOLO format.</li>
            <li>• Train using combined India and Japan datasets.</li>
            <li>• Evaluate on unseen dashcam footage.</li>
            <li>• Improve prediction quality through confidence tuning.</li>
          </ul>
        </div>

        {/* Dataset */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Database className="text-emerald-400" size={20} />
            Dataset
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold text-white">
                Dataset
              </p>

              <p className="mt-2 text-zinc-400">
                RDD2022 (India + Japan)
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold text-white">
                Detection Class
              </p>

              <p className="mt-2 text-zinc-400">
                D40 (Potholes)
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Cpu className="text-purple-400" size={20} />
            Pipeline
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "XML Parsing",
              "Class Filtering",
              "YOLO Conversion",
              "Train / Validation Split",
              "YOLOv8 Training",
              "Video Inference",
              "Confidence Tuning",
            ].map((step) => (
              <span
                key={step}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <BarChart3 className="text-orange-400" size={20} />
            Key Outcomes
          </h3>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-green-900/50 bg-green-500/10 p-6">
              <h4 className="font-semibold text-green-400">
                Reduced False Positives
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Increasing the confidence threshold produced cleaner
                predictions while preserving important detections.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900/50 bg-blue-500/10 p-6">
              <h4 className="font-semibold text-blue-400">
                Better Generalization
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Evaluated successfully on dashcam footage collected from
                multiple Indian cities.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-900/50 bg-purple-500/10 p-6">
              <h4 className="font-semibold text-purple-400">
                Practical Deployment
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Demonstrates an end-to-end workflow suitable for future
                smart road maintenance systems.
              </p>
            </div>

          </div>
        </div>

        {/* Future */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Rocket className="text-pink-400" size={20} />
            Future Improvements
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "Multi-Class Detection",
              "Night Evaluation",
              "Rain Conditions",
              "GPS Integration",
              "Edge Deployment",
              "Mobile Application",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* GitHub */}

        <div className="border-t border-zinc-800 pt-8">

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            View Full Project on GitHub
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            Full source code, dataset preparation scripts, model training,
            inference pipeline and documentation are available in the repository.
          </p>

        </div>

        {/* Footer */}

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center">

          <p className="text-sm text-zinc-500">
            Interested in the implementation details?
          </p>

          <p className="mt-3 text-zinc-400">
            The complete source code, training pipeline, dataset preparation,
            evaluation notebooks and documentation are available on GitHub.
          </p>

        </div>

      </div>
    </section>
  );
}