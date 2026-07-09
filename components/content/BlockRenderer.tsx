import { Check } from "lucide-react";
import type { Block } from "@/lib/content";
import { SmartImage } from "@/components/ui/SmartImage";

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

function BlockItem({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(block.level, 3), 4);
      const Tag = (`h${level}` as "h3") ;
      const cls =
        level >= 4
          ? "mt-6 text-lg font-semibold text-navy-800"
          : "mt-8 font-display text-2xl text-navy-800";
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
                <span className="text-[1.0625rem] leading-snug">{item}</span>
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
              <span className="text-[1.0625rem] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "image":
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
