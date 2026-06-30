import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, GraduationCap, BookOpen, BarChart3, Bell,
  DollarSign, ClipboardList, Calendar, TrendingUp,
  ClipboardCheck, MessageSquare, ArrowRight, Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const quickLinks = [
  { label: "Students", icon: Users, path: "/portal/admin/students", gradient: "from-[#0a2342] to-[#1a5276]" },
  { label: "Teachers", icon: GraduationCap, path: "/portal/admin/teachers", gradient: "from-yellow-400 to-amber-500", text: "text-gray-900" },
  { label: "Classes", icon: BookOpen, path: "/portal/admin/classes", gradient: "from-[#0d3460] to-[#1a5276]" },
  { label: "Reports", icon: BarChart3, path: "/portal/admin/reports", gradient: "from-yellow-500 to-amber-400", text: "text-gray-900" },
  { label: "Fees", icon: DollarSign, path: "/portal/admin/fees", gradient: "from-[#0a2342] to-[#0d3460]" },
  { label: "Timetable", icon: Calendar, path: "/portal/admin/timetables", gradient: "from-amber-400 to-yellow-300", text: "text-gray-900" },
  { label: "Attendance", icon: ClipboardCheck, path: "/portal/admin/attendance", gradient: "from-[#1a5276] to-[#0d3460]" },
  { label: "Announcements", icon: Bell, path: "/portal/admin/announcements", gradient: "from-yellow-400 to-amber-500", text: "text-gray-900" },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [studentsRes, teachersRes, classesRes, announcementsRes, assignmentsRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/users/teachers'),
        api.get('/classes'),
        api.get('/announcements'),
        api.get('/assignments/admin/feed'),
      ]);
      return {
        students: studentsRes.data?.length || 0,
        teachers: teachersRes.data?.length || 0,
        classes: classesRes.data.data?.length || 0,
        announcements: announcementsRes.data?.data || announcementsRes.data || [],
        assignments: assignmentsRes.data?.data || [],
      };
    },
  });

  const stats = [
    { label: "Total Students", value: statsData?.students ?? "—", icon: Users, gradient: "from-[#0a2342] to-[#1a5276]", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Teachers", value: statsData?.teachers ?? "—", icon: GraduationCap, gradient: "from-yellow-400 to-amber-500", bg: "bg-yellow-50", border: "border-yellow-100" },
    { label: "Active Classes", value: statsData?.classes ?? "—", icon: BookOpen, gradient: "from-[#0d3460] to-[#1a5276]", bg: "bg-sky-50", border: "border-sky-100" },
    { label: "Announcements", value: statsData?.announcements?.length ?? "—", icon: Bell, gradient: "from-amber-400 to-yellow-400", bg: "bg-amber-50", border: "border-amber-100" },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-0.5">{greeting} 👋</p>
          <h1 className="text-2xl font-extrabold text-gray-900">{user?.name || "Administrator"}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {now.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          to="/portal/admin/announcements"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white text-sm font-bold rounded-xl shadow hover:opacity-90 transition-all"
        >
          <Bell className="w-4 h-4" /> New Announcement
        </Link>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-28" />
            ))
          : stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className={`bg-white rounded-2xl border ${s.border} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md shrink-0`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                </div>
              </motion.div>
            ))}
      </div>

      {/* ── Quick Links ── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-400 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickLinks.map((ql, i) => (
            <motion.div key={ql.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <Link
                to={ql.path}
                className="group flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ql.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <ql.icon className={`w-5 h-5 ${ql.text ?? "text-white"}`} />
                </div>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{ql.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom two columns ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Announcements */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm">Recent Announcements</h3>
            </div>
            <Link to="/portal/admin/announcements" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : statsData?.announcements?.length > 0 ? (
              statsData.announcements.slice(0, 5).map((a: any, i: number) => (
                <div key={i} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                  </div>
                  {a.content && <p className="text-xs text-gray-400 mt-0.5 ml-4.5 line-clamp-1">{a.content}</p>}
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No announcements yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Assignments */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <ClipboardList className="w-3.5 h-3.5 text-gray-900" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm">Recent Assignments</h3>
            </div>
            <Link to="/portal/admin/assignments" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : statsData?.assignments?.length > 0 ? (
              statsData.assignments.slice(0, 5).map((a: any) => (
                <div key={a._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.title}</p>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                      {a.submission_count || 0} submitted
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.teacher?.name || "Unknown"} · {a.subject_name} · {a.class_name}
                  </p>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No assignments posted yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;
