"use client";

import { useState } from "react";

const links = [
  {
    title: "LinkedIn",
    subtitle: "Professional Profile",
    description:
      "Experience, certifications and professional journey.",
    href: "https://www.linkedin.com/in/shubham-kummar-3207561b5/",
    emoji: "💼",
  },
  {
    title: "GitHub",
    subtitle: "Source Code",
    description:
      "Projects, experiments and open-source work.",
    href: "https://github.com/skroy57099-ux?tab=repositories",
    emoji: "💻",
  },
  {
    title: "Email",
    subtitle: "Let's Connect",
    description:
      "skroy57099@gmail.com",
    emoji: "📧",
  },
];

export default function ProfileLinks() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("skroy57099@gmail.com");

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-white">
          Professional Links
        </h2>

        <p className="mt-2 text-neutral-400">
          Everything you need to verify my work and get in touch.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {links.map((link) => {
          const isEmail = link.title === "Email";

          if (isEmail) {
            return (
              <button
                key={link.title}
                onClick={copyEmail}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-neutral-800"
              >
                <div className="text-4xl">
                  {link.emoji}
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {link.title}
                </h3>

                <p className="mt-1 text-sm text-blue-400">
                  {link.subtitle}
                </p>

                <p className="mt-4 text-sm leading-6 text-neutral-400 break-all">
                  {link.description}
                </p>

                <div className="mt-6 text-sm font-medium text-white">
                  {copied ? "✅ Copied!" : "📋 Copy Email →"}
                </div>
              </button>
            );
          }

          return (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-neutral-800"
            >
              <div className="text-4xl">
                {link.emoji}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {link.title}
              </h3>

              <p className="mt-1 text-sm text-blue-400">
                {link.subtitle}
              </p>

              <p className="mt-4 text-sm leading-6 text-neutral-400">
                {link.description}
              </p>

              <div className="mt-6 text-sm font-medium text-white transition group-hover:translate-x-1">
                {link.title === "GitHub"
                  ? "Open GitHub →"
                  : "Open LinkedIn →"}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}