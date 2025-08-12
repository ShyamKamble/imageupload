import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";
import {FocusCardsDemo} from "@/componentbyme/Focuscards.jsx";
import {AppSidebar } from "@/componentbyme/Sidebarbyme.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ForYouPage() {
  return (
    <>
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
    <div className=" mt-20 ">
      <FocusCardsDemo />
    </div>
    <FocusCardsDemo />
     <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
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
