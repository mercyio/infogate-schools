import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, GraduationCap, BookOpen, BarChart3, Bell,
  DollarSign, ClipboardList, Calendar, TrendingUp,
  ClipboardCheck, MessageSquare, ArrowRight, Activity,
  Megaphone, CheckCircle2, AlertTriangle, Layers,
  Wrench, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const quickLinks = [
  { label: "Students",     icon: Users,         path: "/portal/admin/students",     gradient: "from-[#0a2342] to-[#1a5276]",      text: "text-white" },
  { label: "Teachers",     icon: GraduationCap, path: "/portal/admin/teachers",     gradient: "from-yellow-400 to-amber-500",      text: "text-gray-900" },
  { label: "Classes",      icon: BookOpen,      path: "/portal/admin/classes",      gradient: "from-[#0d3460] to-[#1a5276]",      text: "text-white" },
  { label: "Timetable",    icon: Calendar,      path: "/portal/admin/timetables",   gradient: "from-amber-400 to-yellow-300",      text: "text-gray-900" },
  { label: "Attendance",   icon: ClipboardCheck,path: "/portal/admin/attendance",   gradient: "from-[#0a2342] to-[#0d3460]",      text: "text-white" },
  { label: "Assignments",  icon: ClipboardList, path: "/portal/admin/assignments",  gradient: "from-yellow-500 to-amber-400",      text: "text-gray-900" },
  { label: "Fees",         icon: DollarSign,    path: "/portal/admin/fees",         gradient: "from-[#1a5276] to-[#0d3460]",      text: "text-white" },
  { label: "Reports",      icon: BarChart3,     path: "/portal/admin/reports",      gradient: "from-amber-500 to-yellow-400",      text: "text-gray-900" },
  { label: "Announcements",icon: Megaphone,     path: "/portal/admin/announcements",gradient: "from-[#0a2342] to-[#1a5276]",      text: "text-white" },
  { label: "Feedback",     icon: MessageSquare, path: "/portal/admin/feedback",     gradient: "from-yellow-400 to-amber-500",      text: "text-gray-900" },
];

function priorityStrip(priority: string) {
  const p = priority?.toLowerCase();
  if (p === "high")   return "bg-red-500";
  if (p === "medium") return "bg-amber-400";
  return "bg-blue-400";
}

function priorityBadge(priority: string) {
  const p = priority?.toLowerCase();
  if (p === "high")   return "bg-red-50 text-red-700 border-red-200";
  if (p === "medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

function subjectColor(name: string) {
  const colors = [
    "from-blue-600 to-blue-400", "from-purple-600 to-violet-400",
    "from-green-600 to-teal-400", "from-orange-500 to-amber-400",
    "from-pink-600 to-rose-400",  "from-indigo-600 to-blue-500",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return colors[h % colors.length];
}

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const [studentsRes, teachersRes, classesRes, announcementsRes, assignmentsRes, dashRes, feedbackRes] = await Promise.all([
        api.get("/users/students"),
        api.get("/users/teachers"),
        api.get("/classes"),
        api.get("/announcements"),
        api.get("/assignments/admin/feed"),
        api.get("/reports/admin/dashboard").catch(() => ({ data: {} })),
        api.get("/feedback").catch(() => ({ data: [] })),
      ]);
      return {
        students: studentsRes.data?.length || 0,
        teachers: teachersRes.data?.length || 0,
        classes: (classesRes.data?.data || classesRes.data || []).length,
        announcements: announcementsRes.data?.data || announcementsRes.data || [],
        assignments: assignmentsRes.data?.data || assignmentsRes.data || [],
        attendanceRate: dashRes.data?.attendanceRate || 0,
        revenue: dashRes.data?.revenue || 0,
        feedback: feedbackRes.data || [],
      };
    },
  });

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const unreadFeedback = (statsData?.feedback || []).filter((f: any) => f.status === "unread").length;

  const stats = [
    {
      label: "Total Students", value: statsData?.students ?? "—",
      icon: Users, gradient: "from-[#0a2342] to-[#1a5276]",
      sub: "Enrolled", accent: "text-[#0a2342]",
    },
    {
      label: "Teachers", value: statsData?.teachers ?? "—",
      icon: GraduationCap, gradient: "from-yellow-400 to-amber-500",
      sub: "Active staff", accent: "text-amber-600",
    },
    {
      label: "Active Classes", value: statsData?.classes ?? "—",
      icon: BookOpen, gradient: "from-[#0d3460] to-[#1a5276]",
      sub: "All levels", accent: "text-[#0d3460]",
    },
    {
      label: "Attendance Rate", value: statsData ? `${statsData.attendanceRate}%` : "—",
      icon: ClipboardCheck, gradient: "from-green-600 to-green-400",
      sub: "Overall today", accent: "text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <p className="text-yellow-300/80 text-sm font-semibold mb-1">{greeting} 👋</p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {user?.name || "Administrator"}
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {format(now, "EEEE, MMMM d, yyyy")} · Infogate School Portal
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="flex items-center gap-3 flex-wrap">
              {unreadFeedback > 0 && (
                <Link
                  to="/portal/admin/feedback"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-yellow-300" />
                  {unreadFeedback} new feedback
                </Link>
              )}
              <Link
                to="/portal/admin/announcements"
                className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-sm font-bold rounded-xl shadow-md transition-colors"
              >
                <Megaphone className="w-4 h-4" /> New Announcement
              </Link>
            </motion.div>
          </div>

          {/* ── Stat cards in header ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-white/10 rounded-2xl animate-pulse" />
                ))
              : stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    custom={i + 2}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow`}>
                        <s.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold text-white">{s.value}</p>
                    <p className="text-white/50 text-xs font-medium mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* ── Quick Access ─────────────────────────────────────────────────── */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Quick Access</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quickLinks.map((ql, i) => (
              <motion.div key={ql.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
                <Link
                  to={ql.path}
                  className="group flex flex-col items-center gap-1.5 bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ql.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <ql.icon className={`w-4 h-4 ${ql.text}`} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{ql.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Main content grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Recent Announcements — 1 col */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Announcements</h3>
              </div>
              <Link to="/portal/admin/announcements" className="text-[10px] font-bold text-[#0a2342] hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-4 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}</div>
              ) : statsData?.announcements?.length > 0 ? (
                statsData.announcements.slice(0, 5).map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                    <div className={`w-1 h-full min-h-[32px] rounded-full mt-1 shrink-0 ${priorityStrip(a.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                      {a.content && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.content}</p>}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${priorityBadge(a.priority)}`}>
                      {(a.priority || "normal").charAt(0).toUpperCase() + (a.priority || "normal").slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center">
                  <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No announcements yet.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Assignments — 2 col */}
          <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <ClipboardList className="w-3.5 h-3.5 text-gray-900" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Recent Assignments</h3>
              </div>
              <Link to="/portal/admin/assignments" className="text-[10px] font-bold text-[#0a2342] hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {isLoading ? (
                <div className="p-4 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
              ) : statsData?.assignments?.length > 0 ? (
                statsData.assignments.slice(0, 5).map((a: any) => {
                  const subjectName = a.subject_name || a.class_subject_id?.subject_id?.name || "Subject";
                  const grad = subjectColor(subjectName);
                  const due = a.due_date ? new Date(a.due_date) : null;
                  const overdue = due && due < now;
                  return (
                    <div key={a._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0 shadow-sm`}>
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {a.teacher?.name || "Unknown"} · {subjectName} · {a.class_name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          {a.submission_count || 0} submitted
                        </span>
                        {due && (
                          <span className={`text-[10px] font-semibold ${overdue ? "text-red-500" : "text-gray-400"}`}>
                            {overdue ? "Overdue" : `Due ${format(due, "MMM d")}`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-10 text-center">
                  <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No assignments posted yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row ────────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Attendance rate card */}
          <motion.div custom={9} variants={fadeUp} initial="hidden" animate="show"
            className="bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wide">Attendance Rate</p>
                <div className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-white mb-1">
                {isLoading ? "—" : `${statsData?.attendanceRate ?? 0}%`}
              </p>
              <p className="text-white/40 text-xs">Overall student attendance today</p>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${statsData?.attendanceRate ?? 0}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    (statsData?.attendanceRate ?? 0) >= 80 ? "bg-green-400" :
                    (statsData?.attendanceRate ?? 0) >= 60 ? "bg-amber-400" : "bg-red-400"
                  }`}
                />
              </div>
              <Link to="/portal/admin/attendance" className="inline-flex items-center gap-1 mt-4 text-yellow-300 text-xs font-bold hover:gap-2 transition-all">
                View monitor <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Feedback snapshot */}
          <motion.div custom={10} variants={fadeUp} initial="hidden" animate="show"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-900" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Feedback</h3>
              </div>
              <Link to="/portal/admin/feedback" className="text-[10px] font-bold text-[#0a2342] hover:underline flex items-center gap-0.5">
                Manage <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: statsData?.feedback?.length ?? 0, color: "text-gray-900", bg: "bg-gray-50" },
                { label: "Unread", value: unreadFeedback, color: "text-yellow-700", bg: "bg-yellow-50" },
                { label: "Actioned", value: (statsData?.feedback || []).filter((f: any) => f.status === "actioned").length, color: "text-green-700", bg: "bg-green-50" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-extrabold ${color}`}>{isLoading ? "—" : value}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            {/* Category breakdown */}
            <div className="mt-4 space-y-2">
              {(["Appreciation", "Complaint", "Suggestion", "Concern"] as const).map(cat => {
                const count = (statsData?.feedback || []).filter((f: any) => f.category === cat).length;
                const total = statsData?.feedback?.length || 1;
                const pct = Math.round((count / total) * 100);
                const colors: Record<string, string> = {
                  Appreciation: "bg-green-400", Complaint: "bg-red-400",
                  Suggestion: "bg-blue-400", Concern: "bg-amber-400",
                };
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-20 shrink-0">{cat}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[cat]}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Revenue + fees */}
          <motion.div custom={11} variants={fadeUp} initial="hidden" animate="show"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-sm">Revenue</h3>
              </div>
              <Link to="/portal/admin/reports" className="text-[10px] font-bold text-[#0a2342] hover:underline flex items-center gap-0.5">
                Full report <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-3xl font-extrabold text-[#0a2342]">
              {isLoading ? "—" : `₦${(statsData?.revenue || 0).toLocaleString()}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total fees collected</p>
            <div className="mt-5 flex flex-col gap-2">
              <Link to="/portal/admin/fees" className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <span className="text-sm font-bold text-gray-700">Manage Class Fees</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
              <Link to="/portal/admin/reports" className="flex items-center justify-between px-4 py-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                <span className="text-sm font-bold text-amber-700">Financial Report</span>
                <ChevronRight className="w-4 h-4 text-amber-500 group-hover:text-amber-700 transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
