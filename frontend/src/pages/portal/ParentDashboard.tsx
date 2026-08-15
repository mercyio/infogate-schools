import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, Bell, Menu, X, Phone, User, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Admissions", path: "/admissions" },
  { name: "Events", path: "/events" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = (user as any)?.full_name ?? user?.name;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setUserDropdown(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["my-children"],
    queryFn: async () => {
      const res = await api.get("/users/parents/my-children");
      return res.data || [];
    },
  });

  const initials = (name: string) =>
    (name || "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const levelColors: Record<string, string> = {
    creche: "bg-pink-100 text-pink-700",
    nursery: "bg-purple-100 text-purple-700",
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-green-100 text-green-700",
    vocational: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 text-center px-4 flex items-center justify-center gap-2">
        <Phone className="w-3 h-3 shrink-0" />
        <span>Admissions open for 2024/2025 — Call us: <strong>+234 800 000 0000</strong></span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img src="/infogate-school-badge.svg" alt="Infogate Schools" className="h-12 w-auto" />
              <div className="hidden sm:block">
                <p className="font-extrabold text-primary text-base leading-tight">Infogate</p>
                <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">Schools</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}
                  className="px-4 py-2 rounded-xl font-semibold text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button onClick={() => setUserDropdown((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-extrabold text-xs">
                      {displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-700 hidden md:block">{displayName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userDropdown ? "rotate-180" : ""}`} />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs font-extrabold text-gray-900 truncate">{displayName}</p>
                      <p className="text-[10px] text-gray-400">Parent Portal</p>
                    </div>
                    <button onClick={() => { setUserDropdown(false); setLogoutModal(true); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => setMobileOpen((o) => !o)} className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl font-semibold text-base text-foreground hover:bg-muted"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-border">
                  <button onClick={() => { setMobileOpen(false); setLogoutModal(true); }}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Welcome, {displayName || "Parent"}
          </h1>
          <p className="text-gray-400 mt-1">Select a child to view their school information</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-14 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <User className="w-10 h-10 text-gray-300" />
            </div>
            <p className="font-extrabold text-gray-700 text-xl">No children linked yet</p>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Please contact the school admin to link your child's profile to your account.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {children.map((child: any, i: number) => {
              const name = child?.user_id?.full_name ?? "Unknown";
              const cls = child?.class_id?.name ?? "No class";
              const level = child?.class_id?.level ?? "";
              const admNo = child?.admission_number ?? "—";
              const status = child?.status ?? "active";
              const outstanding = Number(child?.total_outstanding ?? child?.outstanding_carried ?? 0) || 0;
              const ini = initials(name);
              // Alternate card accent colours so multiple children look distinct
              const accents = [
                { dot: "bg-yellow-400", badge: "bg-yellow-400 text-gray-900" },
                { dot: "bg-sky-400",    badge: "bg-sky-400 text-white" },
                { dot: "bg-pink-400",   badge: "bg-pink-400 text-white" },
                { dot: "bg-emerald-400",badge: "bg-emerald-400 text-white" },
              ];
              const accent = accents[i % accents.length];

              return (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => navigate(`/portal/parent/child/${child._id}`)}
                    className="w-full text-left rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    {/* Full-card navy background */}
                    <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] p-6 relative overflow-hidden">
                      {/* Dot pattern */}
                      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

                      {/* Large decorative circle */}
                      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/5" />
                      <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

                      <div className="relative z-10">
                        {/* Top row: avatar + status */}
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-16 h-16 rounded-2xl ${accent.dot} flex items-center justify-center text-gray-900 font-extrabold text-2xl shadow-lg`}>
                            {ini}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                            status === "active" ? "bg-green-400/20 text-green-300 border border-green-400/30" : "bg-white/10 text-white/50 border border-white/15"
                          }`}>
                            {status}
                          </span>
                        </div>

                        {/* Name & class */}
                        <h2 className="text-white font-extrabold text-xl leading-tight">{name}</h2>
                        <p className="text-white/50 text-sm mt-1">{cls}</p>

                        <div className="mt-4 rounded-2xl bg-white/10 border border-white/10 px-3 py-2 backdrop-blur-sm">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/55">Outstanding</p>
                          <p className="mt-1 text-xl font-extrabold text-red-400">₦{outstanding.toLocaleString()}</p>
                        </div>

                        {/* Divider */}
                        <div className="my-4 border-t border-white/10" />

                        {/* Bottom row: level + admission + arrow */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide ${accent.badge}`}>
                              {level || "—"}
                            </span>
                            <span className="text-white/40 text-xs font-semibold">{admNo}</span>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-white/60" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Logout modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mb-3">
                <LogOut className="w-6 h-6 text-red-300" />
              </div>
              <h2 className="text-white font-extrabold text-xl">Sign out?</h2>
              <p className="text-white/60 text-sm mt-1">You'll need to log back in to see your child's information.</p>
            </div>
            <div className="px-6 py-5 flex gap-3">
              <button onClick={() => setLogoutModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-base font-bold text-gray-600 hover:bg-gray-50"
              >Cancel</button>
              <button onClick={() => { logout(); navigate("/login"); }}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-base font-extrabold"
              >Yes, Sign out</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
