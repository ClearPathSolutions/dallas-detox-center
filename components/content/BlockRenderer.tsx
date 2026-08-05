import { Check } from "lucide-react";
import type { Block } from "@/lib/content";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/cn";
import { isApprovedSrc } from "@/lib/media";

function isChecklist(items: string[]) {
  const avg = items.reduce((n, s) => n + s.length, 0) / Math.max(items.length, 1);
  return avg < 90;
}

export function BlockFlow({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => (
        <BlockItem key={i} block={b} />
      ))}
    </div>
  );
}

/**
 * Several list items arrive as a short title welded to its own sentence —
 * "360 Individualized Care Every client that enters…" — which is how the
 * original site published them. Where a separator has been added to the copy,
 * the title is set in a heavier weight so the two read apart.
 */
function ListItemText({ text }: { text: string }) {
  const at = text.indexOf(" — ");
  if (at === -1) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-navy-800">{text.slice(0, at)}</strong>
      {text.slice(at + 1)}
    </>
  );
}

function BlockItem({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      // Floor is 2, not 3: lib/blocks.ts normalises levels so the outline never
      // skips, and a section with no heading of its own needs an H2 here.
      const level = Math.min(Math.max(block.level, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      const cls =
        level >= 4
          ? "mt-6 text-lg font-semibold text-navy-800"
          : level === 3
            ? "mt-8 font-display text-2xl text-navy-800"
            : "mt-10 font-display text-3xl text-navy-800";
      return <Tag className={cls}>{block.text}</Tag>;
    }
    case "paragraph":
      return (
        <p
          className="text-[1.0625rem] leading-relaxed text-navy-600 [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:text-brand-800 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-navy-800"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "list":
      if (isChecklist(block.items)) {
        return (
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-navy-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-[1.0625rem] leading-snug">
                  <ListItemText text={item} />
                </span>
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul className="space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-navy-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              <span className="text-[1.0625rem] leading-relaxed">
                <ListItemText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "image": {
      // Only approved facility photography renders. Legacy content images are
      // dropped: most were duplicate crops, and the rest were stock photos of
      // places that are not this facility.
      if (!isApprovedSrc(block.src)) return null;
    }
      return (
        <figure className="my-2 overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-900/5">
          <SmartImage src={block.src} alt={block.alt || ""} />
        </figure>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-brand-400 bg-sand-50 py-4 pl-5 pr-4 text-lg italic text-navy-700">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}
