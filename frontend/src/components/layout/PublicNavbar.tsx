import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Admissions", path: "/admissions" },
  { name: "Events", path: "/events" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = isAuthenticated ? `/portal/${user?.role}` : "/login";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-2 text-center px-4 flex items-center justify-center gap-2">
        <Phone className="w-3 h-3 shrink-0" />
        <span>Admissions open for 2024/2025 — Call us: <strong>+234 800 000 0000</strong></span>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg border-b border-border"
          : "bg-white/95 backdrop-blur-md border-b border-border/50"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18 py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <motion.img
                whileHover={{ scale: 1.05, rotate: -2 }}
                src="/infogate-school-badge.svg"
                alt="Infogate Schools"
                className="h-14 w-auto"
              />
              <div className="hidden sm:block">
                <p className="font-extrabold text-primary text-base leading-tight">Infogate</p>
                <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">Schools</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to={dashboardPath}>
                <Button variant="outline" size="sm" className="font-semibold flex items-center gap-1.5">
                  {isAuthenticated ? <><LayoutDashboard className="w-3.5 h-3.5" /> Dashboard</> : "Portal Login"}
                </Button>
              </Link>
              <Link to="/admissions">
                <Button size="sm" className="font-bold bg-primary hover:bg-primary/90 shadow-md">
                  Apply Now →
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold text-base transition-all ${
                      location.pathname === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                  <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full font-semibold flex items-center justify-center gap-1.5">
                      {isAuthenticated ? <><LayoutDashboard className="w-4 h-4" /> Dashboard</> : "Portal Login"}
                    </Button>
                  </Link>
                  <Link to="/admissions" onClick={() => setIsOpen(false)}>
                    <Button className="w-full font-bold bg-primary">Apply Now →</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default PublicNavbar;
