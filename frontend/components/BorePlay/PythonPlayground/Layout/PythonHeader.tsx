"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PythonHeader() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/bore-play");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-6">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back
      </button>
    </div>
  );
}