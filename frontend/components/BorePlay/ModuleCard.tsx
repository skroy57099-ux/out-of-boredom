import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
}

export default function ModuleCard({
  title,
  description,
  image,
  tags,
  href,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        flex
        flex-col
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-card
        p-8
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="max-w-[85%]">

          <h3 className="text-2xl font-semibold tracking-tight">
            {title}
          </h3>

          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {description}
          </p>

        </div>

        <ArrowUpRight
          size={20}
          className="
            shrink-0
            transition-transform
            duration-300
            group-hover:translate-x-1
            group-hover:-translate-y-1
          "
        />

      </div>

      {/* Illustration */}

      <div
        className="
          relative
          mt-6
          flex
          flex-1
          items-center
          justify-center
          min-h-[300px]
        "
      >
        {/* Soft Glow */}

        <div
          className="
            absolute
            h-64
            w-64
            rounded-full
            bg-cyan-500/5
            blur-3xl
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />

        <Image
          src={image}
          alt={title}
          fill
          className="
            object-contain
            scale-110
            transition-transform
            duration-500
            group-hover:scale-[1.15]
          "
        />
      </div>

      {/* Footer */}

      <div className="mt-4">

        <div className="flex flex-wrap gap-2">

          {tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                border
                border-white/10
                px-3
                py-1
                text-xs
                text-muted-foreground
              "
            >
              {tag}
            </span>
          ))}

        </div>

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
          "
        >

          <span
            className="
              font-medium
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            Enter Workspace
          </span>

          <ArrowUpRight
            size={18}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
          />

        </div>

      </div>
    </Link>
  );
}
