interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, description, center }: SectionHeaderProps) {
  return (
    <div className={`mb-6 md:mb-10 ${center ? 'text-center' : ''}`}>
      <span className="text-[11px] text-text-tertiary uppercase tracking-wider block mb-2">{label}</span>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 md:mb-3">{title}</h2>
      {description && <p className="text-sm md:text-base text-text-tertiary">{description}</p>}
    </div>
  );
}
