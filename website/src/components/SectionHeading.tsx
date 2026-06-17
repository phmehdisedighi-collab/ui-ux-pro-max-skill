export function SectionHeading({
  kicker,
  title,
  center = false,
  light = false,
}: {
  kicker?: string;
  title: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      {kicker && (
        <span className="mb-2 inline-block text-sm font-black uppercase tracking-wider text-orange">
          {kicker}
        </span>
      )}
      <h2
        className={`${center ? 'gold-underline-center' : 'gold-underline'} text-3xl sm:text-4xl ${
          light ? 'text-white' : 'text-surmei'
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
