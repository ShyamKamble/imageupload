"use client"

import React from "react"
import { SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import HoverExpand from "../components/ui/hover-expand.jsx"
import { PointerHighlightDemo } from "@/componentbyme/First.jsx";

const images = [
  "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://assets.lummi.ai/assets/QmQLSBeCFHUwCv7WBpGr7T3P67UXaAw8B2vvmtKimyinrL?auto=format&w=1500",
  "https://assets.lummi.ai/assets/QmXe6v7jBF5L2R7FCio8KQdXwTX2uqzRycUJapyjoXaTqd?auto=format&w=1500",
  "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  
]

export function MouseTrailDemo() {
  return (
    <section className="mx-auto w-full max-w-5xl">
  <div className="relative mx-auto flex w-full flex-col items-center justify-center transform -translate-y-24">
    <article className="relative z-50 mt-20 flex flex-col items-center justify-center">
      <div className="max-w-2xl text-center text-5xl font-semibold tracking-tight ">
        <PointerHighlightDemo />
      </div>
    </article>
    <HoverExpand
      images={images}
      initialSelectedIndex={0}
      thumbnailHeight={200}
      modalImageSize={400}
      maxThumbnails={11}
    />
  </div>
</section>
  )
}
