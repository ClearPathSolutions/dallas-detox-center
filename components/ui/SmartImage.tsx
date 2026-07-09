import Image from "next/image";
import dims from "@/content/image-dims.json";
import { cn } from "@/lib/cn";

const DIMS = dims as Record<string, { w: number; h: number }>;

/**
 * next/image wrapper that looks up intrinsic dimensions from the prebuilt map,
 * so migrated content images render at the correct aspect with no layout shift.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 800px, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const d = DIMS[src] ?? { w: 1200, h: 800 };
  return (
    <Image
      src={src}
      alt={alt}
      width={d.w}
      height={d.h}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}
