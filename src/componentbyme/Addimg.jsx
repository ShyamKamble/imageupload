"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      className="object-cover absolute inset-0 w-full h-full"
    />

    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));
Card.displayName = "Card";

// AddCard Component — same size as Card, but routes to upload
export const AddCard = () => (
  <Link
    href="/upload"
    className="rounded-lg h-60 md:h-96 w-full flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-neutral-600 hover:border-blue-500 hover:dark:border-blue-400 transition-colors cursor-pointer"
  >
    <span className="text-gray-500 dark:text-gray-300 text-lg font-medium">
      + Add Image
    </span>
  </Link>
);
