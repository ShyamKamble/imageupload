"use client"

import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"


export function NavigationMenuDemo() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  return (
    <div className="flex justify-between items-center w-full">
      {/* Left side navigation */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
    <Link href="/" className="font-semibold  text-xl">Home </Link>
  </NavigationMenuLink>
            
          </NavigationMenuItem>
          <NavigationMenuItem>
             <NavigationMenuLink asChild>
    <Link href="/for-you" className="font-semibold  text-xl">For You</Link>
  </NavigationMenuLink>
            
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side Auth */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="font-semibold text-xl px-4 py-2 hover:text-primary transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="font-semibold text-xl">
                  Sign In
                </Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}