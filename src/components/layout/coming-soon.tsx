import { ConstructionIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({
  title,
  description,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40">
          <HugeiconsIcon
            icon={ConstructionIcon}
            className="size-5 text-muted-foreground"
          />
        </div>

        <h1 className="text-xl font-semibold tracking-tight">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}