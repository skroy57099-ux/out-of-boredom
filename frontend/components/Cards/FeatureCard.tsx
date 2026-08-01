type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 p-6 hover:border-white transition cursor-pointer">

      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-gray-400">
        {description}
      </p>

    </div>
  );
}
