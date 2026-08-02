import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  to?: string;
  className?: string;
  variant?: "pill" | "split";
};

export function PillButton({ label, to = "/", className, variant = "pill" }: Props) {
  if (variant === "split") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link
          to={to}
          className="rounded-full border border-hairline bg-surface-card/70 px-8 py-2 text-sm text-ink transition-colors hover:bg-surface-card"
        >
          {label}
        </Link>
        <Link
          to={to}
          aria-label={label}
          className="grid size-11 place-items-center rounded-full border border-hairline bg-surface-card/70 text-ink transition-colors hover:bg-surface-card"
        >
          <ArrowUpRight className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card/70 px-8 py-2 text-sm text-ink transition-colors hover:bg-surface-card",
        className,
      )}
    >
      {label}
      <ArrowUpRight className="size-4" strokeWidth={1.5} />
    </Link>
  );
}
