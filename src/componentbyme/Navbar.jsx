"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"


export function NavigationMenuDemo() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    // Check token on mount and route change
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
      }
    };
    
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };
  
  return (
    <div className="flex justify-between items-center w-full">
      {/* Left side navigation */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-12">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="font-semibold text-xl">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/for-you" className="font-semibold text-xl">Gallery</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/upload" className="font-semibold text-xl">Upload</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side Auth */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="gap-4">
          {!isLoggedIn ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/login" className="font-semibold text-xl px-6">
                    Sign In
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/signup" className="font-semibold text-xl px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                    Sign Up
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <button 
                  onClick={handleLogout}
                  className="font-semibold text-xl px-6 py-2 hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}