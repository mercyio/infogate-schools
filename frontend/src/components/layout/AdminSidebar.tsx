import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  LayoutDashboard,
  Shield,
  Search,
  Plus,
  LogOut,
  ClipboardCheck,
  DollarSign,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/portal/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    url: "/portal/admin/students",
    icon: Users,
  },
  {
    title: "Teachers",
    url: "/portal/admin/teachers",
    icon: GraduationCap,
  },
  {
    title: "Classes",
    url: "/portal/admin/classes",
    icon: BookOpen,
  },
  {
    title: "Reports",
    url: "/portal/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Attendance",
    url: "/portal/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Announcements",
    url: "/portal/admin/announcements",
    icon: Bell,
  },
  {
    title: "Fees Management",
    url: "/portal/admin/fees",
    icon: DollarSign,
  },
  {
    title: "Assignments",
    url: "/portal/admin/assignments",
    icon: ClipboardList,
  },
  {
    title: "Feedback Review",
    url: "/portal/admin/feedback",
    icon: MessageSquare,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm">Infogate Admin</span>
            <span className="text-[10px] text-muted-foreground">School Management</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70 font-semibold group-data-[collapsible=icon]:hidden">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary hover:bg-primary/20" 
                          : "hover:bg-muted"
                      )}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="group-data-[collapsible=icon]:hidden font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-primary/5">
        <SidebarMenu>
          {/* User Profile removed based on request */}

          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => logout()} 
              tooltip="Logout"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
