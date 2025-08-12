'use client';
import { CalendarDemo } from "@/componentbyme/calendar-demo.jsx";
import { ProgressDemo } from "@/componentbyme/Progress.jsx";
import { SkiperCardDemo } from "@/componentbyme/Skip.jsx";
import { CardSwipe } from "../components/ui/card-swipe.jsx";
import {  AnimatedNumberRandomDemo } from "../componentbyme/Countdown.jsx";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";
import ThreeScene from "@/componentbyme/ThreeScene.jsx";
import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";
import { SlideButton } from "@/componentbyme/Slide.jsx";
import { Inter, Roboto, Montserrat } from "next/font/google";
import "@fontsource/tiro-devanagari-marathi"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";
import { PointerHighlightDemo } from "@/componentbyme/First.jsx";
import { MouseTrailDemo } from "@/componentbyme/Herosection.jsx";
import Projects from "@/componentbyme/Adi.jsx";
import {MinimalCardDemo} from "../componentbyme/Card.jsx";
import {FeaturesSectionDemo} from "../componentbyme/Featuresection.jsx";
import { InfiniteMovingCardsDemo } from "@/componentbyme/Scroll.jsx";
import { Footer2 } from "@/componentbyme/Footer.jsx";
import { AuthUI } from "@/components/AuthUI.jsx";
const inter = Inter({ subsets: ['latin'] });

export default function Page() {

//backdrop-blur-md"
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-center">
      <div className="
 fixed top-0 left-1/2 
  w-full max-w-2xl md:max-w-4xl 
  transform -translate-x-1/2
  z-50
  bg-transparent
  backdrop-blur-md
  shadow-lg  
  rounded-xl 
 
  px-6 py-4
  transition-all duration-300
">
  <NavigationMenuDemo />
</div>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-20 p-4">
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

  );
}

