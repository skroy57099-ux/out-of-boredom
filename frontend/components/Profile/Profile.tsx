"use client";

import ProfileHero from "./ProfileHero";
import ProfileLinks from "./ProfileLinks";
import ResumePreview from "./ResumePreview";
import ProfileHighlights from "./ProfileHighlights";

export default function Profile() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
        <ProfileHero />

        <ProfileLinks />

        <ResumePreview />

        <ProfileHighlights />
      </div>
    </main>
  );
}
