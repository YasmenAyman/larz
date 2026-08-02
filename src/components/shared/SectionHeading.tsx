import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-[1.2rem] tracking-[0.32em] text-ink-dim uppercase">{eyebrow}</p>
      <h2 className="mx-auto mt-2 max-w-3xl text-3xl leading-[1.25] font-normal text-ink sm:text-4xl md:text-[3.3rem]">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
