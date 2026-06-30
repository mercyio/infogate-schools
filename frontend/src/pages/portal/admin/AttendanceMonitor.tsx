import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Users,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Filter,
  BookOpen,
  Layers,
  Wrench,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format, addDays, subDays, isToday } from "date-fns";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teacher {
  _id: string;
  user_id?: { full_name?: string; email?: string };
  specialization?: string;
  role?: string;
}

interface TeacherRecord {
  _id: string;
  teacher_id?: { _id?: string } | string;
  status: "present" | "absent" | "late";
  updatedAt: string;
}

interface StudentRecord {
  _id: string;
  class_id?: { _id?: string } | string;
  status: "present" | "absent" | "late";
}

interface SchoolClass {
  _id: string;
  name: string;
  level?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META: Record<string, { icon: typeof BookOpen; gradient: string }> = {
  nursery:    { icon: Layers,        gradient: "from-pink-500 to-rose-400" },
  primary:    { icon: BookOpen,      gradient: "from-blue-600 to-blue-400" },
  secondary:  { icon: GraduationCap, gradient: "from-purple-600 to-violet-400" },
  vocational: { icon: Wrench,        gradient: "from-amber-500 to-orange-400" },
};

function levelMeta(level?: string) {
  return LEVEL_META[(level || "").toLowerCase()] ?? { icon: BookOpen, gradient: "from-[#0a2342] to-[#1a5276]" };
}

function teacherId(r: TeacherRecord) {
  return typeof r.teacher_id === "object" ? r.teacher_id?._id : r.teacher_id;
}

function classId(r: StudentRecord) {
  return typeof r.class_id === "object" ? r.class_id?._id : r.class_id;
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; icon: typeof CheckCircle2; label: string }> = {
  present: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", icon: CheckCircle2,    label: "Present" },
  absent:  { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",   icon: XCircle,         label: "Absent"  },
  late:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", icon: AlertTriangle,   label: "Late"    },
};

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.absent;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, total, subtitle, accent, delay,
}: {
  label: string; value: number; total?: number; subtitle?: string; accent: string; delay: number;
}) {
  const pct = total ? Math.round((value / total) * 100) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className={`text-3xl font-extrabold ${accent}`}>{value}</span>
        {total !== undefined && (
          <span className="text-sm text-gray-400 font-semibold">/ {total}</span>
        )}
      </div>
      {pct !== null && (
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-medium">Compliance</span>
            <span className={`text-[10px] font-bold ${accent}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: delay + 0.3, ease: "easeOut" }}
              className={`h-full rounded-full ${
                pct >= 80 ? "bg-gradient-to-r from-green-400 to-green-500" :
                pct >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                "bg-gradient-to-r from-red-400 to-red-500"
              }`}
            />
          </div>
        </div>
      )}
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </motion.div>
  );
}

// ─── Teacher Row ──────────────────────────────────────────────────────────────

function TeacherRow({ teacher, record, index }: { teacher: Teacher; record?: TeacherRecord; index: number }) {
  const name = teacher.user_id?.full_name || "Unknown";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const marked = !!record;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 transition-colors ${
        !marked ? "bg-red-50/40" : "hover:bg-gray-50/60"
      }`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm shadow-sm ${
        marked ? "bg-gradient-to-br from-[#0a2342] to-[#1a5276] text-white" : "bg-gray-200 text-gray-500"
      }`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">{teacher.specialization || teacher.role || "Teacher"}</p>
      </div>

      {/* Time */}
      <div className="text-right shrink-0 hidden sm:block">
        {marked ? (
          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(record!.updatedAt), "h:mm a")}
          </p>
        ) : (
          <p className="text-xs text-gray-300">—</p>
        )}
      </div>

      {/* Status */}
      <div className="shrink-0">
        {marked ? (
          <StatusChip status={record!.status} />
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-gray-50 text-gray-400 border-gray-200">
            <XCircle className="w-3 h-3" /> Not Marked
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────

function ClassCard({ cls, isMarked, records, index }: {
  cls: SchoolClass; isMarked: boolean; records: StudentRecord[]; index: number;
}) {
  const meta = levelMeta(cls.level);
  const Icon = meta.icon;
  const presentCount = records.filter((r) => r.status === "present").length;
  const totalCount = records.length;
  const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isMarked ? "border-gray-100 hover:shadow-md" : "border-dashed border-gray-200 opacity-60"
      }`}
    >
      {/* Top strip */}
      <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {isMarked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3 h-3" /> Marked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200">
              Pending
            </span>
          )}
        </div>

        <h4 className="font-extrabold text-gray-900">{cls.name}</h4>
        {cls.level && (
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white bg-gradient-to-r ${meta.gradient}`}>
            {cls.level.charAt(0).toUpperCase() + cls.level.slice(1)}
          </span>
        )}

        {isMarked && totalCount > 0 ? (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500 font-medium">{presentCount}/{totalCount} present</span>
              <span className={`font-extrabold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-amber-600" : "text-red-600"}`}>
                {pct}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: index * 0.04 + 0.4 }}
                className={`h-full rounded-full ${
                  pct >= 80 ? "bg-gradient-to-r from-green-400 to-green-500" :
                  pct >= 60 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                  "bg-gradient-to-r from-red-400 to-red-500"
                }`}
              />
            </div>
            {/* Mini breakdown */}
            <div className="flex gap-3 mt-3">
              {[
                { label: "Present", key: "present", color: "text-green-600" },
                { label: "Absent",  key: "absent",  color: "text-red-500" },
                { label: "Late",    key: "late",    color: "text-amber-500" },
              ].map(({ label, key, color }) => {
                const count = records.filter((r) => r.status === key).length;
                if (count === 0) return null;
                return (
                  <div key={key} className="text-center">
                    <p className={`text-sm font-extrabold ${color}`}>{count}</p>
                    <p className="text-[10px] text-gray-400">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : !isMarked ? (
          <p className="text-xs text-gray-400 mt-4 italic">Attendance not yet recorded</p>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AttendanceMonitor = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"teachers" | "classes">("teachers");
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const formattedDate = format(date, "yyyy-MM-dd");
  const isCurrentDay = isToday(date);

  const { data: teachers = [], isLoading: loadingTeachers } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => { const res = await api.get("/users/teachers"); return res.data; },
  });

  const { data: teacherRecords = [], isLoading: loadingTR } = useQuery<TeacherRecord[]>({
    queryKey: ["attendance", "teachers", formattedDate],
    queryFn: async () => { const res = await api.get(`/attendance/teachers?date=${formattedDate}`); return res.data; },
  });

  const { data: studentRecords = [], isLoading: loadingSR } = useQuery<StudentRecord[]>({
    queryKey: ["attendance", "students", "all", formattedDate],
    queryFn: async () => { const res = await api.get(`/attendance?date=${formattedDate}`); return res.data; },
  });

  const { data: dbClasses = [], isLoading: loadingClasses } = useQuery<SchoolClass[]>({
    queryKey: ["classes"],
    queryFn: async () => { const res = await api.get("/classes"); return res.data?.data || res.data || []; },
  });

  const isLoading = loadingTeachers || loadingTR || loadingSR || loadingClasses;

  // Derived data
  const markedTeacherIds = useMemo(
    () => new Set(teacherRecords.map((r) => teacherId(r))),
    [teacherRecords]
  );

  const markedClassIds = useMemo(
    () => new Set(studentRecords.map((r) => classId(r))),
    [studentRecords]
  );

  const teachersMarked = teachers.filter((t) => markedTeacherIds.has(t._id));
  const presentStudents = studentRecords.filter((r) => r.status === "present").length;
  const presentPct = studentRecords.length > 0
    ? Math.round((presentStudents / studentRecords.length) * 100) : 0;

  // Filtered lists
  const visibleTeachers = useMemo(
    () => showPendingOnly ? teachers.filter((t) => !markedTeacherIds.has(t._id)) : teachers,
    [teachers, markedTeacherIds, showPendingOnly]
  );

  const visibleClasses = useMemo(
    () => showPendingOnly ? dbClasses.filter((c) => !markedClassIds.has(c._id)) : dbClasses,
    [dbClasses, markedClassIds, showPendingOnly]
  );

  // Navigate dates
  const goDay = (delta: number) => setDate((d) => delta > 0 ? addDays(d, 1) : subDays(d, 1));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276]">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-gray-900" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Attendance Monitor</h1>
              </div>
              <p className="text-white/50 text-sm ml-[52px]">Daily marking compliance for teachers and classes</p>
            </div>

            {/* Date navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goDay(-1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-bold transition-colors min-w-[160px] justify-center">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    {isCurrentDay ? "Today" : format(date, "MMM d, yyyy")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarPicker
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <button
                onClick={() => goDay(1)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                disabled={isCurrentDay}
              >
                <ChevronRight className={`w-4 h-4 ${isCurrentDay ? "opacity-30" : ""}`} />
              </button>

              {!isCurrentDay && (
                <button
                  onClick={() => setDate(new Date())}
                  className="px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs rounded-xl transition-colors shadow-md"
                >
                  Today
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Teacher Compliance"
            value={teachersMarked.length}
            total={teachers.length}
            accent="text-[#0a2342]"
            delay={0}
          />
          <StatCard
            label="Class Compliance"
            value={markedClassIds.size}
            total={dbClasses.length}
            accent="text-purple-700"
            delay={0.07}
          />
          <StatCard
            label="Students Present"
            value={presentStudents}
            total={studentRecords.length}
            accent="text-green-700"
            delay={0.14}
          />
          <StatCard
            label="Absence Rate"
            value={100 - presentPct}
            subtitle={`${studentRecords.filter((r) => r.status === "absent").length} absent · ${studentRecords.filter((r) => r.status === "late").length} late`}
            accent={presentPct >= 80 ? "text-green-700" : "text-red-600"}
            delay={0.21}
          />
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 pt-2">
            <div className="flex gap-1">
              {([
                { key: "teachers", label: "Teachers", icon: GraduationCap, count: teachers.length },
                { key: "classes",  label: "Classes",  icon: Users, count: dbClasses.length },
              ] as const).map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === key
                      ? "border-[#0a2342] text-[#0a2342]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    activeTab === key ? "bg-[#0a2342] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowPendingOnly((p) => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                showPendingOnly
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              <Filter className="w-3 h-3" />
              {showPendingOnly ? "Showing pending only" : "Show pending only"}
            </button>
          </div>

          {/* Tab content */}
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* ── Teachers tab ─────────────────────────────────────────── */}
              {activeTab === "teachers" && (
                <motion.div
                  key="teachers"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Compliance summary bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50/70 border-b border-gray-100">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {teachersMarked.length} marked
                      </span>
                      <span className="flex items-center gap-1.5 text-red-500">
                        <XCircle className="w-3.5 h-3.5" />
                        {teachers.length - teachersMarked.length} pending
                      </span>
                    </div>
                    <span className={`text-xs font-extrabold ${
                      teachers.length === 0 ? "text-gray-400" :
                      teachersMarked.length / teachers.length >= 0.8 ? "text-green-600" :
                      teachersMarked.length / teachers.length >= 0.5 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {teachers.length === 0 ? "—" : `${Math.round(teachersMarked.length / teachers.length * 100)}% compliance`}
                    </span>
                  </div>

                  {visibleTeachers.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-300" />
                      <p className="font-semibold">All teachers have marked attendance!</p>
                    </div>
                  ) : (
                    <div>
                      {visibleTeachers.map((teacher, i) => {
                        const record = teacherRecords.find((r) => teacherId(r) === teacher._id);
                        return <TeacherRow key={teacher._id} teacher={teacher} record={record} index={i} />;
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Classes tab ───────────────────────────────────────────── */}
              {activeTab === "classes" && (
                <motion.div
                  key="classes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5"
                >
                  {/* Compliance bar */}
                  <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {markedClassIds.size} marked
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-500">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {dbClasses.length - markedClassIds.size} pending
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-gray-500">
                      {studentRecords.length} students tracked
                    </span>
                  </div>

                  {visibleClasses.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-300" />
                      <p className="font-semibold">All classes have recorded attendance!</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {visibleClasses.map((cls, i) => {
                        const marked = markedClassIds.has(cls._id);
                        const records = studentRecords.filter((r) => classId(r) === cls._id);
                        return (
                          <ClassCard key={cls._id} cls={cls} isMarked={marked} records={records} index={i} />
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 px-1 pb-4">
          {Object.entries(STATUS_STYLES).map(([key, s]) => {
            const Icon = s.icon;
            return (
              <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                <Icon className={`w-3.5 h-3.5 ${s.text}`} /> {s.label}
              </span>
            );
          })}
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <XCircle className="w-3.5 h-3.5 text-gray-400" /> Not Marked
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMonitor;
