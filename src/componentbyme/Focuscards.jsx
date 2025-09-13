"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../src/lib/superbaseClient";
import ZoomImage from "../componentbyme/Zoomimg";
import { useRouter } from "next/navigation";


export function FocusCardsDemo() {
  const [cards, setCards] = useState([]);
  const router = useRouter();
  useEffect(() => {
    let ignore = false;

    const fetchImages = async () => {
  const { data, error } = await supabase.storage
    .from("firstproject")
    .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    console.error("Error fetching images:", error);
    return;
  }

  if (!ignore) {
    const fetched = data
      .filter((file) => file.name)
      .map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("firstproject")
          .getPublicUrl(file.name);

        return {
          id: file.id ?? file.name, 
          title: file.name.split(".")[0],
          src: publicUrlData.publicUrl,
          storagePath: file.name, 
        };
      });

    setCards(fetched);
  }
};


    fetchImages();
    return () => { ignore = true; };
  }, []);

  // Same grid, same sizes as your original FocusCards
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
       
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden"
        >
         <ZoomImage
  src={card.src}
  alt={card.title}
  layoutKey={card.id}
  thumbClass="w-full h-60 md:h-96"
  storagePath={card.storagePath} 
  onDeleted={(deletedPath) => {
    
    setCards((prev) => prev.filter((c) => c.storagePath !== deletedPath));
  }}
/>


          
          <div className="pointer-events-none absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end py-8 px-4">
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
              {card.title}
            </div>
          </div>
          
        </div>
        
      ))}
      <div
        onClick={() => router.push("/for-you/index")}
        className="rounded-lg relative h-60 md:h-96 bg-gray-100 dark:bg-neutral-900 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all duration-300"
      >
        <span className="text-6xl font-bold text-gray-500">+</span>
        <span className="mt-3 text-gray-500 text-lg font-medium">
          Add Image
        </span>
      </div>
    </div>
  );
}
// src/componentbyme/Focuscards.jsx
