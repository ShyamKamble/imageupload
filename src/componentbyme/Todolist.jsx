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
const inter = Inter({ subsets: ['latin'] });

export default function Page() {
  const [tasks, setTasks] = useState([
 
  ]);
  const [input, setInput] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTasks([...tasks, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-center">
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl z-50 bg-opacity-30 backdrop-blur-md">
        <NavigationMenuDemo />
      </div>
      <div className="flex flex-col items-center w-full max-w-sm mt-8">
        <div className="flex flex-col w-full gap-2 bg-white border rounded-lg p-4 mb-8">
          <form
            className="flex w-full justify-center gap-2 mb-4"
            onSubmit={handleAddTask}
          >
            <Input
              type="text"
              placeholder="tasks"
              className="text-black"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              className={`text-black border-solid border-gray-300 hover:bg-gray-100 ${inter.className}`}
            >
              Enter
            </Button>
          </form>
          {tasks.map((task, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Checkbox className="text-black" />
              <span className="text-black">{task}</span>
            </div>
          ))}
        </div>
      </div>
     
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
