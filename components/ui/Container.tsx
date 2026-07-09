import { cn } from "@/lib/cn";

/**
 * Page shell. Caps content at a comfortable 1280px and centers it, with fluid
 * gutters that grow on larger screens — so desktop reads as a designed layout,
 * never a narrow mobile column stranded in whitespace.
 */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
