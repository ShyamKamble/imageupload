"use client";

import React, { useState, useEffect } from "react";
import { RollingText } from "./../components/ui/rolling-text";

export function InfiniteMovingCardsDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setKey((prev) => prev + 1);
    }, 8000); // Change customer every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-[30rem] rounded-md flex flex-col antialiased bg-[#030712] items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="max-w-4xl w-full">
        <div key={key} className="flex flex-col items-center text-center space-y-6">
          <RollingText 
            text={currentTestimonial.name.toUpperCase()} 
            speed={0.03} 
            duration={800}
            className="text-sm"
          />
          <blockquote className="max-w-3xl space-y-4">
            <RollingText 
              text={currentTestimonial.quote} 
              speed={0.015} 
              duration={600}
              className="text-base leading-relaxed"
            />
            <div className="mt-4 text-gray-500">
              <p className="text-xs">{currentTestimonial.title}</p>
            </div>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "This platform completely transformed how we manage our image library. The AI-powered organization saves us hours every week.",
    name: "Sarah Chen",
    title: "Creative Director, Design Studio",
  },
  {
    quote:
      "Secure cloud storage with seamless sharing capabilities. Our team collaboration has never been more efficient.",
    name: "Michael Rodriguez",
    title: "Product Manager, Tech Startup",
  },
];
