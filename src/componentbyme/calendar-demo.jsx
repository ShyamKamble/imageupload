'use client';

import React from "react";
import { Calendar } from "@/components/ui/calendar"; // Make sure this exists!

export function CalendarDemo() {
  const [date, setDate] = React.useState(new Date());

  return (
    <div className="flex items-center justify-center h-screen p-4 rounded-md">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        //className="rounded-md border shadow-sm bg-black text-white"
       className="rounded-md border shadow-sm bg-gray-900 text-cyan-200"
      />
       <ProgressDemo />
    </div>
  );
}

     
     

