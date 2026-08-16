"use client";

import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";
import { FocusCardsDemo } from "@/componentbyme/Focuscards.jsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForYouPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div
        className="
        fixed top-0 left-0 right-0
        w-full
        z-50
        bg-transparent
        backdrop-blur-md
        shadow-lg  
        rounded-xl 
        px-4 md:px-6 py-4
        transition-all duration-300
      "
      >
        <NavigationMenuDemo />
      </div>

      <div className="mt-20">
        <FocusCardsDemo />
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        <ThemeToggleButton
          showLabel
          variant="gif"
          url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        />
      </div>
    </>
  );
}
