
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  CalendarDays, LayoutGrid, Table, List, 
  LogOut, Settings, Search, Users, UserPlus, 
  Home, PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarRail, 
  SidebarTrigger, 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function AppSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Get user initials for avatar
  const username = localStorage.getItem("username") || "User";
  const initials = username.substring(0, 2).toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSignOut = () => {
    localStorage.setItem("isAuthenticated", "false");
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const navItems = [
    {
      to: "/",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard 📊",
    },
    {
      to: "/tasks",
      icon: <LayoutGrid className="w-5 h-5" />,
      label: "Tasks 📝",
    },
    {
      to: "/calendar",
      icon: <CalendarDays className="w-5 h-5" />,
      label: "Calendar 📅",
    },
    {
      to: "/table",
      icon: <Table className="w-5 h-5" />,
      label: "Table 📋",
    },
    {
      to: "/timeline",
      icon: <List className="w-5 h-5" />,
      label: "Timeline ⏱️",
    },
    {
      to: "/users",
      icon: <Users className="w-5 h-5" />,
      label: "Users 👥",
    },
    {
      to: "/teams",
      icon: <UserPlus className="w-5 h-5" />,
      label: "Teams 👪",
    },
    {
      to: "/search",
      icon: <Search className="w-5 h-5" />,
      label: "Search 🔍",
    },
    {
      to: "/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings ⚙️",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">TaskVista</h3>
              <p className="text-sm text-muted-foreground">Welcome, {username}! 👋</p>
            </div>
          </div>
          <SidebarTrigger />
        </div>
        
        <form onSubmit={handleSearch} className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.to)}
                tooltip={item.label}
              >
                <Link to={item.to} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="w-full gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out 👋
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
