"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

export function ProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 5; 
      if (current >= 100) {
        current = 100;
        setProgress(current);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Progress value={progress} className="w-[60%]" />
      <span className="text-sm text-gray-500">{progress}%</span>
      {progress === 100 && (
        <span className="text-black-500 font-semibold">Loaded!</span>
      )}
    </div>
 
  );
}