'use client';
import { useState } from "react";
import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";
import { MouseTrailDemo } from "@/componentbyme/Herosection.jsx";
import {FeaturesSectionDemo} from "../componentbyme/Featuresection.jsx";
import { InfiniteMovingCardsDemo } from "@/componentbyme/Scroll.jsx";
import { Footer2 } from "@/componentbyme/Footer.jsx";
import Preloader from "@/componentbyme/Preloader.jsx";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}
    
    <div className={`relative min-h-screen flex flex-col items-center justify-center bg-center ${isLoading ? 'overflow-hidden h-screen' : ''}`}>
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent backdrop-blur-md shadow-lg px-4 md:px-12 py-4 transition-all duration-300">
        <NavigationMenuDemo />
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-20 px-4">
        <MouseTrailDemo />
      </div>
      <FeaturesSectionDemo />
      <InfiniteMovingCardsDemo />
      <Footer2 />
      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggleButton
          showLabel
          variant="gif"
          url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        />
      </div>
    </div>
    </>
  );
}

