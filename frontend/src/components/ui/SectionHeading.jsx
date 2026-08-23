export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center mb-11">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
