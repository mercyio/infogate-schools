import {
  Users, GraduationCap, BookOpen, Calendar, BarChart3,
  Bell, LayoutDashboard, LogOut, ClipboardCheck,
  DollarSign, ClipboardList, MessageSquare, ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/portal/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Students", url: "/portal/admin/students", icon: Users },
      { title: "Teachers", url: "/portal/admin/teachers", icon: GraduationCap },
      { title: "Parents", url: "/portal/admin/parents", icon: Users },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Classes", url: "/portal/admin/classes", icon: BookOpen },
      { title: "Timetable", url: "/portal/admin/timetables", icon: Calendar },
      { title: "Assignments", url: "/portal/admin/assignments", icon: ClipboardList },
      { title: "Attendance", url: "/portal/admin/attendance", icon: ClipboardCheck },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Reports", url: "/portal/admin/reports", icon: BarChart3 },
      { title: "Fees", url: "/portal/admin/fees", icon: DollarSign },
      { title: "Announcements", url: "/portal/admin/announcements", icon: Bell },
      { title: "Feedback", url: "/portal/admin/feedback", icon: MessageSquare },
    ],
  },
];

export function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (url: string) =>
    url === "/portal/admin"
      ? location.pathname === url
      : location.pathname.startsWith(url);

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-gradient-to-b from-[#0a2342] via-[#0d3460] to-[#0f3d6e] text-white transition-all duration-300 shrink-0 relative",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 relative">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/35 px-3 mb-2">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.url);
                return (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      title={collapsed ? item.title : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative",
                        active
                          ? "bg-yellow-400 text-gray-900 shadow-md"
                          : "text-white/65 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-gray-900" : "text-white/60 group-hover:text-white")} />
                      {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                      {!collapsed && active && <ChevronRight className="w-3.5 h-3.5 text-gray-900/60" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 shrink-0 relative">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center shrink-0">
              <span className="text-gray-900 font-extrabold text-xs">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{user.name}</p>
              <p className="text-white/40 text-[10px] truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="Logout"
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
