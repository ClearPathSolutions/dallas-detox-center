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
  preload,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Next 16 renamed `priority` to `preload`; use for above-the-fold images. */
  preload?: boolean;
}) {
  const d = DIMS[src] ?? { w: 1200, h: 800 };
  return (
    <Image
      src={src}
      alt={alt}
      width={d.w}
      height={d.h}
      sizes={sizes}
      preload={preload}
      className={cn("h-auto w-full", className)}
    />
  );
}
