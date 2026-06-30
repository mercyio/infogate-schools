import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, Search, Menu, X, Home, Info, BookOpen, Calendar, Image, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "About", path: "/about", icon: Info },
  { label: "Admissions", path: "/admissions", icon: BookOpen },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Gallery", path: "/gallery", icon: Image },
  { label: "Contact", path: "/contact", icon: Phone },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ── Public Navbar (top) ── */}
      <nav className="bg-gradient-to-r from-[#0a2342] via-[#0d3460] to-[#1a5276] text-white shrink-0 z-50">
        <div className="flex items-center justify-between px-5 h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/infogate-school-badge.svg" alt="Infogate" className="h-8 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm font-extrabold text-white leading-none">Infogate Schools</p>
              <p className="text-[10px] text-white/45">One With God is a Majority</p>
            </div>
          </Link>

          {/* Public page links */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((l) => {
              const active = location.pathname === l.path;
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active ? "bg-yellow-400 text-gray-900" : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <l.icon className="w-3.5 h-3.5" />
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right: role badge */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl">
              <div className="w-5 h-5 rounded-md bg-yellow-400 flex items-center justify-center">
                <span className="text-gray-900 font-extrabold text-[10px]">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs font-bold text-white/80">{user?.name}</span>
              <span className="text-[10px] text-yellow-300 font-bold capitalize bg-yellow-400/15 px-1.5 py-0.5 rounded-md">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Dashboard row (sidebar + content) ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <AdminSidebar collapsed={collapsed} />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Dashboard top bar */}
          <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <div className="h-4 w-px bg-gray-200 hidden sm:block" />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, staff, classes..."
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 w-60 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              </button>
              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0d3460] to-[#1a5276] flex items-center justify-center">
                  <span className="text-white font-extrabold text-[10px]">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-xs font-bold text-gray-700 hidden sm:block">{user?.name}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
