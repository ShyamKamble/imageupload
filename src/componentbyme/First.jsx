import { PointerHighlight } from "@/components/ui/pointer-highlight";

export function PointerHighlightDemo() {
  return (
    <div
      className="mx-auto max-w-2xl text-3xl md:text-6xl font-extrabold tracking-tight"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      Store images in 
      <PointerHighlight>
        <span> collaborative ways</span>
      </PointerHighlight>
    </div>
  );
}
