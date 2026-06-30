import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Printer,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Trophy,
  BookOpen,
  GraduationCap,
  Clock,
  XCircle,
  Minus,
} from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeacherRow {
  name: string;
  email: string;
  specialization: string;
  attendanceRate: number | null;
  attendanceDays: { marked: number; present: number; late: number; absent: number };
  assignmentsCount: number;
  classesCount: number;
}

interface Summary {
  total: number;
  avgAttendance: number;
  topPerformer: string | null;
  atRisk: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rateColor(rate: number | null) {
  if (rate === null) return { bar: "bg-gray-300", text: "text-gray-400", badge: "bg-gray-100 text-gray-500 border-gray-200" };
  if (rate >= 90) return { bar: "bg-green-500",  text: "text-green-700",  badge: "bg-green-50 text-green-700 border-green-200" };
  if (rate >= 75) return { bar: "bg-amber-400",  text: "text-amber-700",  badge: "bg-amber-50 text-amber-700 border-amber-200" };
  return             { bar: "bg-red-500",    text: "text-red-700",    badge: "bg-red-50 text-red-700 border-red-200" };
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function avatarGradient(name: string) {
  const colors = [
    "from-blue-600 to-blue-400",
    "from-purple-600 to-violet-400",
    "from-teal-600 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-pink-600 to-rose-400",
    "from-indigo-600 to-indigo-400",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffff;
  return colors[h % colors.length];
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, accent, delay }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

// ─── Teacher Card ─────────────────────────────────────────────────────────────

function TeacherCard({ teacher, index }: { teacher: TeacherRow; index: number }) {
  const c = rateColor(teacher.attendanceRate);
  const grad = avatarGradient(teacher.name);
  const rate = teacher.attendanceRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* top accent strip */}
      <div className={`h-1 ${rate === null ? "bg-gray-200" : rate >= 90 ? "bg-green-500" : rate >= 75 ? "bg-amber-400" : "bg-red-500"}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-extrabold text-sm shadow-md shrink-0`}>
            {initials(teacher.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 truncate">{teacher.name}</p>
            <p className="text-xs text-gray-400 truncate">{teacher.specialization}</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
            {rate !== null ? `${rate}%` : "No Data"}
          </span>
        </div>

        {/* Attendance bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-medium">Attendance</span>
            <span className={`font-bold ${c.text}`}>{rate !== null ? `${rate}%` : "—"}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: rate !== null ? `${rate}%` : "0%" }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.04, ease: "easeOut" }}
              className={`h-full rounded-full ${c.bar}`}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-gray-50 rounded-xl py-2.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
            <p className="text-sm font-extrabold text-gray-900">{teacher.assignmentsCount}</p>
            <p className="text-[10px] text-gray-400">Assignments</p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl py-2.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-500 mx-auto mb-1" />
            <p className="text-sm font-extrabold text-gray-900">{teacher.classesCount}</p>
            <p className="text-[10px] text-gray-400">Classes</p>
          </div>
          <div className="text-center bg-gray-50 rounded-xl py-2.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
            <p className="text-sm font-extrabold text-gray-900">{teacher.attendanceDays.marked}</p>
            <p className="text-[10px] text-gray-400">Days Rec.</p>
          </div>
        </div>

        {/* Attendance breakdown */}
        {teacher.attendanceDays.marked > 0 && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
              <CheckCircle2 className="w-3 h-3" />{teacher.attendanceDays.present} present
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
              <Clock className="w-3 h-3" />{teacher.attendanceDays.late} late
            </span>
            <span className="flex items-center gap-1 text-[11px] text-red-500 font-semibold">
              <XCircle className="w-3 h-3" />{teacher.attendanceDays.absent} absent
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TeacherPerformanceReport = () => {
  const [searchParams] = useSearchParams();
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["teacherPerformanceReport"],
    queryFn: async () => {
      const response = await api.get("/reports/admin/teacher-report");
      return response.data;
    },
  });

  const teachers: TeacherRow[] = reportData?.teachers || [];
  const summary: Summary = reportData?.summary || { total: 0, avgAttendance: 0, topPerformer: null, atRisk: 0 };

  // Sort: no-data last, then by rate desc
  const sorted = [...teachers].sort((a, b) => {
    if (a.attendanceRate === null && b.attendanceRate === null) return 0;
    if (a.attendanceRate === null) return 1;
    if (b.attendanceRate === null) return -1;
    return b.attendanceRate - a.attendanceRate;
  });

  const excellent = teachers.filter(t => t.attendanceRate !== null && t.attendanceRate >= 90).length;
  const atRisk    = teachers.filter(t => t.attendanceRate !== null && t.attendanceRate < 75).length;

  useEffect(() => {
    if (searchParams.get("print") === "1" && !isLoading) {
      const t = setTimeout(() => { handleDownloadPDF(); }, 800);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isLoading]);

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Teacher_Performance_Report_${new Date().getFullYear()}`;
    window.print();
    document.title = originalTitle;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0a2342] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          * { box-shadow: none !important; }
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link to="/portal/admin/reports" className="no-print">
                <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">Teacher Performance</h1>
                  <p className="text-white/50 text-sm">Staff attendance, assignments & class metrics</p>
                </div>
              </div>
            </div>
            <div className="no-print flex gap-2">
              <Button variant="outline" onClick={handleDownloadPDF} className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button onClick={handleDownloadPDF} className="gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-md border-none">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* ── Summary Stats ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Staff"       value={summary.total}           sub="Active teachers"            icon={Users}         accent="from-[#0a2342] to-[#1a5276]" delay={0}    />
          <StatCard label="Avg Attendance"    value={`${summary.avgAttendance}%`} sub="Across all teachers"    icon={TrendingUp}    accent="from-green-600 to-green-400"  delay={0.07} />
          <StatCard label="Excellent (≥90%)"  value={excellent}               sub="High performers"            icon={Trophy}        accent="from-yellow-500 to-amber-400" delay={0.14} />
          <StatCard label="At Risk (<75%)"    value={atRisk}                  sub="Need attention"             icon={AlertTriangle} accent="from-red-600 to-red-400"      delay={0.21} />
        </div>

        {/* ── Top Performer Banner ──────────────────────────────────────────── */}
        {summary.topPerformer && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Top Performer</p>
              <p className="font-extrabold text-gray-900">{summary.topPerformer}</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-xs text-amber-600 font-semibold">Highest attendance rate this period</p>
            </div>
          </motion.div>
        )}

        {/* ── Teacher Cards Grid ────────────────────────────────────────────── */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="font-semibold">No teacher records found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((teacher, i) => (
              <TeacherCard key={teacher.name} teacher={teacher} index={i} />
            ))}
          </div>
        )}

        {/* ── Attendance Distribution Table ──────────────────────────────────── */}
        {sorted.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#0a2342] rounded-full" />
              <h3 className="font-extrabold text-gray-900">Staff Performance Table</h3>
              <span className="ml-auto text-xs text-gray-400 font-medium">{teachers.length} teachers</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[11px] font-extrabold uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Teacher</th>
                    <th className="px-6 py-3 text-left">Specialization</th>
                    <th className="px-6 py-3 text-center">Days Recorded</th>
                    <th className="px-6 py-3 text-center">Present</th>
                    <th className="px-6 py-3 text-center">Late</th>
                    <th className="px-6 py-3 text-center">Absent</th>
                    <th className="px-6 py-3 text-center">Assignments</th>
                    <th className="px-6 py-3 text-center">Classes</th>
                    <th className="px-6 py-3 text-center">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sorted.map((t, i) => {
                    const c = rateColor(t.attendanceRate);
                    return (
                      <tr key={t.name} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-bold text-xs">{i + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGradient(t.name)} flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                              {initials(t.name)}
                            </div>
                            <span className="font-bold text-gray-900 truncate max-w-[120px]">{t.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{t.specialization}</td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-700">{t.attendanceDays.marked}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />{t.attendanceDays.present}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                            <Clock className="w-3 h-3" />{t.attendanceDays.late}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                            <XCircle className="w-3 h-3" />{t.attendanceDays.absent}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-blue-700">{t.assignmentsCount}</td>
                        <td className="px-6 py-4 text-center font-semibold text-purple-700">{t.classesCount}</td>
                        <td className="px-6 py-4 text-center">
                          {t.attendanceRate !== null ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${c.badge}`}>
                              {t.attendanceRate}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                              <Minus className="w-3 h-3" /> No data
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-5 px-1 pb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /> ≥ 90% Excellent</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> 75–89% Good</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> &lt; 75% At Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-300" /> No data recorded</span>
        </div>
      </div>
    </div>
  );
};

export default TeacherPerformanceReport;
