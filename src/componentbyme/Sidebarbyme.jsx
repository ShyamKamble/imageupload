"use client";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
  const { state, setOpen } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <SidebarContent>
        <div className="flex justify-end p-2 gap-2">
          {/* Minimize (when expanded) */}
          {!collapsed && (
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Minimize Sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {/* Maximize (when collapsed) */}
          {collapsed && (
            <button
              onClick={() => setOpen(true)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Maximize Sidebar"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Application"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center gap-2 px-2 py-1 ${
                        collapsed ? "justify-center" : ""
                      }`}
                    >
                      <item.icon size={20} />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
