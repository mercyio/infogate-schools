import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Home, Layers, FileText, CalendarCheck } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

const NAV_TABS = [
  { label: "Home", path: "/portal/teacher", icon: Home },
  { label: "Classes", path: "/portal/teacher#classes", icon: Layers },
  { label: "Assignments", path: "/portal/teacher/assignments", icon: FileText },
  { label: "Attendance", path: "/portal/teacher/attendance", icon: CalendarCheck },
] as const;

const TeacherSubPageLayout = ({ title, subtitle, action, children }: Props) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -left-10 bottom-0 w-52 h-52 rounded-full bg-white/5" />

      <div className="relative z-10 container mx-auto px-6 max-w-2xl">
        <div className="flex items-center justify-between pt-6 pb-8 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/portal/teacher"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Teacher Portal</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-white/55 text-xs md:text-sm mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

    </div>

    {/* Page content */}
    <div className="container mx-auto px-5 py-6 max-w-2xl">
      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {NAV_TABS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={label}
                to={path}
                className={`flex items-center justify-center gap-2 rounded-[1.35rem] px-4 py-3 text-sm font-semibold transition-all ${active ? "bg-[#0a2342] text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
    </div>
  );
};

export default TeacherSubPageLayout;
