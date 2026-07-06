import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, Users, FileText, LogOut,
  CheckCircle2, ClipboardCheck, Clock,
  ChevronRight, Home, Layers, Award,
  CalendarCheck, Plus, Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

interface GroupedStudent {
  class: { _id: string; name: string; level: string; academic_year: string };
  subject: { _id?: string; name: string; code?: string };
  class_subject_id: string | null;
  students: Array<{ _id: string; user?: { full_name?: string }; user_id?: { full_name?: string }; admission_number?: string }>;
}

const TABS = [
  { key: "home",        label: "Home",       icon: Home         },
  { key: "classes",     label: "Classes",    icon: Layers       },
  { key: "assignments", label: "Assignments",icon: FileText     },
  { key: "attendance",  label: "Attendance", icon: CalendarCheck},
] as const;
type Tab = typeof TABS[number]["key"];

const LEVEL_COLOR: Record<string, string> = {
  creche:     "bg-pink-50 text-pink-700 border-pink-100",
  nursery:    "bg-purple-50 text-purple-700 border-purple-100",
  primary:    "bg-blue-50 text-blue-700 border-blue-100",
  secondary:  "bg-green-50 text-green-700 border-green-100",
  vocational: "bg-orange-50 text-orange-700 border-orange-100",
};

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const now = new Date();
  const todayIndex = now.getDay();
  const curMin = now.getHours() * 60 + now.getMinutes();

  const [activeTab, setActiveTab]     = useState<Tab>("home");
  const [logoutModal, setLogoutModal] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // attendance tab
  const [attendanceClassId, setAttendanceClassId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // assignments tab
  const getGroupKey = (g: GroupedStudent) => g.class_subject_id ?? `${g.class._id}:${g.subject._id || g.subject.name}`;
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", due_date: "", total_marks: "100" });

  // ── Data ──────────────────────────────────────────────────────────
  const { data: teacherProfile } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: async () => { const r = await api.get("/users/me/teacher"); return r.data; },
  });

  const { data: groups = [], isLoading } = useQuery<GroupedStudent[]>({
    queryKey: ["teacher-groups"],
    queryFn: async () => { const r = await api.get("/users/teacher/students/grouped"); return r.data || []; },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: async () => { const r = await api.get("/assignments"); return Array.isArray(r.data) ? r.data : []; },
  });

  const normalizeLevel = (lv?: string) => (lv === 'creche' ? 'nursery' : (lv || '') ).toLowerCase();
  const uniqueLevels = useMemo(() => [...new Set(groups.map(g => normalizeLevel(g.class.level)))].filter(Boolean), [groups]);

  const { data: timetables = [] } = useQuery({
    queryKey: ["teacher-timetable-all", uniqueLevels],
    enabled: uniqueLevels.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        uniqueLevels.map(lv => 
          api.get(`/timetables?level=${lv.toLowerCase()}`).then(r => 
            Array.isArray(r.data) ? r.data.map((t: any) => ({ ...t, _level: lv.toLowerCase() })) : []
          )
        )
      );
      return results.flat();
    },
  });

  const { data: todayAttendance = [] } = useQuery({
    queryKey: ["teacher-attendance-today", teacherProfile?._id, today],
    enabled: !!teacherProfile?._id,
    queryFn: async () => {
      const r = await api.get(`/attendance/teachers?teacher_id=${teacherProfile._id}&date=${today}`);
      return Array.isArray(r.data) ? r.data : [];
    },
  });

  const { data: existingStudentAttendance } = useQuery({
    queryKey: ["attendance-grouped", attendanceClassId, today],
    enabled: !!attendanceClassId,
    queryFn: async () => {
      const r = await api.get(`/attendance?class_id=${attendanceClassId}&date=${today}`);
      if (Array.isArray(r.data)) {
        const map: Record<string, string> = {};
        r.data.forEach((rec: any) => { map[rec.student_id?._id || rec.student_id] = rec.status; });
        setAttendance(map);
      }
      return r.data;
    },
  });

  const hasMarkedToday = todayAttendance.length > 0;

  const clockIn = useMutation({
    mutationFn: () => api.post("/attendance/teachers", {
      records: [{ teacher_id: teacherProfile?._id, date: today, status: "present" }],
    }),
    onSuccess: () => { toast.success("Attendance marked!"); qc.invalidateQueries({ queryKey: ["teacher-attendance-today"] }); },
    onError: () => toast.error("Failed to mark attendance"),
  });

  const markStudentAttendance = useMutation({
    mutationFn: (records: any) => api.post("/attendance", { records }),
    onSuccess: () => { toast.success("Attendance saved!"); qc.invalidateQueries({ queryKey: ["attendance-grouped"] }); },
    onError: () => toast.error("Failed to save attendance"),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const g = groups.find(g => getGroupKey(g) === selectedGroupKey);
      if (!g?.class_subject_id) throw new Error("Class/subject not linked yet.");
      return api.post("/assignments", {
        title:            form.title.trim(),
        description:      form.description.trim(),
        class_subject_id: g.class_subject_id,
        due_date:         form.due_date,
        total_marks:      Number(form.total_marks),
      });
    },
    onSuccess: () => {
      toast.success("Assignment created!");
      setShowCreate(false);
      setForm({ title: "", description: "", due_date: "", total_marks: "100" });
      qc.invalidateQueries({ queryKey: ["teacher-assignments"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || e?.message || "Failed"),
  });

  // ── Derived ───────────────────────────────────────────────────────
  const fullName = teacherProfile?.user_id?.full_name ?? (user as any)?.full_name ?? user?.name ?? "Teacher";
  const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const uniqueClasses = useMemo(() => {
    const map = new Map<string, GroupedStudent["class"]>();
    groups.forEach(g => map.set(g.class._id, g.class));
    return Array.from(map.values());
  }, [groups]);

  // Support both old single and new array field
  const assignedClasses: Array<{ _id: string; name: string; level: string }> =
    teacherProfile?.assigned_classes?.length
      ? teacherProfile.assigned_classes
      : teacherProfile?.assigned_class
        ? [teacherProfile.assigned_class]
        : [];
  const assignedClass = assignedClasses[0] ?? null; // keep legacy compat

  const subjectMap = useMemo(() => {
    const map = new Map<string, { name: string; code?: string; classes: GroupedStudent[] }>();
    groups.forEach(g => {
      const key = g.subject._id ?? g.subject.name;
      if (!map.has(key)) map.set(key, { name: g.subject.name, code: g.subject.code, classes: [] });
      map.get(key)!.classes.push(g);
    });
    return Array.from(map.values());
  }, [groups]);

  // Today's schedule grouped per class — include class-teacher (all slots) and subject teachers (matching subjects)
  const todaysByClass = useMemo(() => {
    const todaySlots = timetables
      .filter((t: any) => t.day_of_week === todayIndex)
      .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));

    return uniqueClasses.map(cls => ({
      cls,
      slots: todaySlots.filter((t: any) => {
        const tLv = (t._level ?? t.level ?? "").toLowerCase();
        const cLv = normalizeLevel(cls.level);
        if (tLv !== cLv) return false;

        const clsGroups = groups.filter(g => String(g.class._id) === String(cls._id));

        // If teacher is class teacher for this class, include all slots
        const isClassTeacher = clsGroups.some(g => !g.subject._id && g.subject.name === 'Class Teacher');
        if (isClassTeacher) return true;

        // Otherwise include only slots matching any subject the teacher teaches for this class
        // Support both populated ObjectId (`_id`) and unpopulated subject name entries
        const teacherSubjectKeys = clsGroups
          .map(g => g.subject._id ? String(g.subject._id) : (g.subject.name || ""))
          .filter(Boolean)
          .map(k => String(k).toLowerCase());

        const slotSubjectKey = (t.subject_id?._id ? String(t.subject_id._id) : (t.subject_id?.name || String(t.subject_id || ""))).toLowerCase();
        return teacherSubjectKeys.includes(slotSubjectKey);
      }),
    })).filter(({ slots }) => slots.length > 0);
  }, [timetables, todayIndex, uniqueClasses, groups]);

  const totalStudents = useMemo(() => groups.reduce((n, g) => n + g.students.length, 0), [groups]);

  const attendanceStudents = useMemo(
    () => groups.find(g => g.class._id === attendanceClassId)?.students ?? [],
    [groups, attendanceClassId]
  );

  const attPresent = attendanceStudents.filter((s: any) => (attendance[s._id] || "present") === "present").length;
  const attAbsent  = attendanceStudents.filter((s: any) => attendance[s._id] === "absent").length;
  const attLate    = attendanceStudents.filter((s: any) => attendance[s._id] === "late").length;

  const handleSaveAttendance = () => {
    if (!attendanceClassId) return toast.error("Select a class");
    const records = attendanceStudents.map((s: any) => ({
      student_id: s._id,
      class_id: attendanceClassId,
      date: today,
      status: attendance[s._id] || "present",
    }));
    markStudentAttendance.mutate(records);
  };

  const selectedGroup = useMemo(() => groups.find(g => getGroupKey(g) === selectedGroupKey), [groups, selectedGroupKey]);
  const groupAssignments = useMemo(() => {
    if (!selectedGroupKey || !selectedGroup) return assignments;
    return assignments.filter((a: any) => {
      const csId = typeof a.class_subject_id === "string" ? a.class_subject_id : a.class_subject_id?._id;
      if (selectedGroup.class_subject_id && csId) return String(csId) === String(selectedGroup.class_subject_id);
      const aClassId = typeof a.class_subject_id === "string" ? undefined : a.class_subject_id?.class_id?._id;
      return String(aClassId || "") === String(selectedGroup.class._id || "");
    });
  }, [assignments, selectedGroup, selectedGroupKey]);

  const handleCreate = () => {
    if (!form.title.trim()) return toast.error("Title required");
    if (!form.due_date)     return toast.error("Due date required");
    if (Number(form.total_marks) <= 0) return toast.error("Marks must be > 0");
    createMutation.mutate();
  };

  const slotBadge = (t: any) => {
    const [sh, sm] = t.start_time.split(":").map(Number);
    const [eh, em] = t.end_time.split(":").map(Number);
    const s = sh * 60 + sm, e = eh * 60 + em;
    if (curMin >= s && curMin < e) return "now";
    if (curMin >= e) return "done";
    return null;
  };

  const getStudentName = (student: any) => student?.user?.full_name ?? student?.user_id?.full_name ?? "Student";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-0 w-52 h-52 rounded-full bg-white/5" />

        <div className="relative z-10 container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-between pt-6 pb-8">
            <div className="flex items-center gap-3">
              <img src="/infogate-school-badge.svg" alt="Infogate" className="h-10 w-auto opacity-90" />
              <div>
                <p className="text-white font-extrabold text-sm leading-tight">Teacher Portal</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Infogate Schools</p>
              </div>
            </div>
            <button onClick={() => setLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-colors border border-white/10">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>

          <div className="flex items-end gap-5 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-gray-900 font-extrabold text-2xl shadow-lg shrink-0">
              {initials}
            </div>
            <div className="pb-0.5">
              <p className="text-white/40 text-xs font-semibold mb-0.5">{greeting}</p>
              <h1 className="text-3xl font-extrabold text-white leading-none tracking-tight">{fullName}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {assignedClasses.length > 0 && (
                  <span className="inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Class Teacher · {assignedClasses.map(c => c.name).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-5 py-6 max-w-2xl">
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${active ? "bg-[#0a2342] text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>

            {/* ══ HOME ══ */}
            {activeTab === "home" && (
              <div className="space-y-5">
                <ClockInBtn hasMarked={hasMarkedToday} isPending={clockIn.isPending} hasProfile={!!teacherProfile} onMark={() => clockIn.mutate()} now={now} />

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Classes", value: uniqueClasses.length, bg: "bg-blue-50", num: "text-blue-800", sub: "text-blue-400", icon: Layers },
                    { label: "Students", value: totalStudents, bg: "bg-green-50", num: "text-green-800", sub: "text-green-400", icon: Users },
                    { label: "Assignments", value: assignments.length, bg: "bg-amber-50", num: "text-amber-800", sub: "text-amber-400", icon: FileText },
                  ].map(({ label, value, bg, num, sub, icon: Icon }) => (
                    <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
                      <Icon className={`w-4 h-4 mx-auto mb-1.5 ${sub}`} />
                      <p className={`text-2xl font-extrabold ${num}`}>{value}</p>
                      <p className={`text-xs font-bold mt-0.5 ${sub}`}>{label}</p>
                    </div>
                  ))}
                </div>

                <Sect label="Quick actions">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Mark Attendance",   tab: "attendance" as Tab, icon: ClipboardCheck },
                      { label: "Create Assignment", tab: "assignments" as Tab, icon: Plus           },
                      { label: "View Timetable",    to: "/portal/teacher/timetable", icon: Clock   },
                      { label: "Grade Submissions", to: "/portal/teacher/gradebook", icon: Award   },
                    ].map(({ label, icon: Icon, tab, to }: any) => {
                      const inner = (
                        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-4 flex items-center gap-3 hover:border-[#0a2342]/20 hover:bg-gray-50 transition-all">
                          <div className="w-9 h-9 rounded-xl bg-[#0a2342] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-bold text-gray-800">{label}</span>
                        </div>
                      );
                      return tab ? (
                        <button key={label} onClick={() => setActiveTab(tab)} className="text-left">{inner}</button>
                      ) : (
                        <Link key={label} to={to}>{inner}</Link>
                      );
                    })}
                  </div>
                </Sect>
              </div>
            )}

            {/* ══ CLASSES ══ */}
            {activeTab === "classes" && (
              <div className="space-y-5">
                {assignedClasses.length > 0 && (
                  <Sect label={`Class teacher role · ${assignedClasses.length} class${assignedClasses.length !== 1 ? "es" : ""}`}>
                    <div className="space-y-3">
                      {assignedClasses.map(cls => (
                        <div key={cls._id} className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Homeroom</p>
                                <h3 className="text-2xl font-extrabold text-white">{cls.name}</h3>
                                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 uppercase">{cls.level}</span>
                              </div>
                              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-yellow-300" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Link to="/portal/teacher/timetable" className="bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-3 py-2.5 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-300 shrink-0" />
                                <span className="text-xs font-bold text-white">View Timetable</span>
                              </Link>
                              <Link to="/portal/teacher/gradebook" className="bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-3 py-2.5 flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-300 shrink-0" />
                                <span className="text-xs font-bold text-white">Gradebook</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Sect>
                )}

                {subjectMap.filter(s => s.name !== "Class Teacher").length > 0 && (
                  <Sect label="Subjects I teach">
                    <div className="space-y-3">
                      {subjectMap.filter(s => s.name !== "Class Teacher").map(subject => (
                        <SCard key={subject.name}>
                          <div className="px-4 py-3.5 border-b border-gray-50 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-extrabold text-gray-900">{subject.name}</p>
                              {subject.code && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{subject.code}</p>}
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                              {subject.classes.length} class{subject.classes.length !== 1 ? "es" : ""}
                            </span>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {subject.classes.map(g => {
                              const lvlColor = LEVEL_COLOR[g.class.level] ?? "bg-gray-50 text-gray-600 border-gray-100";
                              const exp = expandedClass === `${subject.name}:${g.class._id}`;
                              return (
                                <div key={g.class._id}>
                                  <button onClick={() => setExpandedClass(exp ? null : `${subject.name}:${g.class._id}`)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                      <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className="text-sm font-bold text-gray-900">{g.class.name}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lvlColor}`}>{g.class.level}</span>
                                        <span className="text-xs text-gray-400">{g.students.length} students</span>
                                      </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${exp ? "rotate-90" : ""}`} />
                                  </button>
                                  <AnimatePresence>
                                    {exp && g.students.length > 0 && (
                                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                        <div className="px-4 pb-3 space-y-1.5 bg-gray-50/50">
                                          {g.students.slice(0, 8).map((s: any, i: number) => (
                                            <div key={s._id} className="flex items-center gap-3 py-1.5">
                                              <span className="text-[10px] text-gray-300 w-5">{i + 1}</span>
                                              <div className="w-6 h-6 rounded-full bg-[#0a2342]/10 flex items-center justify-center">
                                                <span className="text-[9px] font-extrabold text-[#0a2342]">{(s.user_id?.full_name ?? "?").charAt(0).toUpperCase()}</span>
                                              </div>
                                              <span className="text-xs font-semibold text-gray-700 truncate">{s.user_id?.full_name ?? "Student"}</span>
                                              {s.admission_number && <span className="ml-auto text-[10px] text-gray-400">{s.admission_number}</span>}
                                            </div>
                                          ))}
                                          {g.students.length > 8 && <p className="text-xs text-gray-400 text-center py-1">+{g.students.length - 8} more</p>}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </SCard>
                      ))}
                    </div>
                  </Sect>
                )}

                {!isLoading && uniqueClasses.length === 0 && assignedClasses.length === 0 && (
                  <SCard><EmptyRow text="No classes assigned yet" /></SCard>
                )}
              </div>
            )}

            {/* ══ ASSIGNMENTS ══ */}
            {activeTab === "assignments" && (
              <div className="space-y-5">
                <AnimatePresence>
                  {showCreate && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-extrabold text-gray-900">New assignment</p>
                          <button onClick={() => setShowCreate(false)} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1">✕</button>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Class & Subject</p>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {groups.map(g => {
                              const key = getGroupKey(g);
                              return (
                                <button key={key} onClick={() => setSelectedGroupKey(key)}
                                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${selectedGroupKey === key ? "bg-[#0a2342] text-white border-transparent" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                  {g.class.name} · {g.subject.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {selectedGroup && !selectedGroup.class_subject_id && (
                          <p className="text-xs bg-amber-50 text-amber-700 rounded-xl px-3 py-2 border border-amber-100">This class/subject isn't linked yet. Contact admin.</p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Title</label>
                            <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Assignment title"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Due date</label>
                            <input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Total marks</label>
                            <input type="number" min={1} value={form.total_marks} onChange={e => setForm(p => ({ ...p, total_marks: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Instructions</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Instructions…"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition" />
                          </div>
                        </div>
                        <button onClick={handleCreate} disabled={createMutation.isPending || !selectedGroup?.class_subject_id}
                          className="w-full py-3 rounded-xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-50 text-white text-sm font-extrabold transition-colors">
                          {createMutation.isPending ? "Creating…" : "Create Assignment"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Sect label={`Assignments · ${assignments.length} total`}>
                  <div className="flex justify-end mb-2 px-1">
                    <button onClick={() => setShowCreate(s => !s)} className="flex items-center gap-1.5 text-xs font-bold text-[#0a2342] hover:opacity-70 transition-opacity">
                      <Plus className="w-3.5 h-3.5" /> New assignment
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
                    <button onClick={() => setSelectedGroupKey(null)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${!selectedGroupKey ? "bg-[#0a2342] text-white border-transparent" : "bg-white text-gray-500 border-gray-200"}`}>
                      All
                    </button>
                    {groups.map(g => {
                      const key = getGroupKey(g);
                      return (
                        <button key={key} onClick={() => setSelectedGroupKey(key)}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedGroupKey === key ? "bg-[#0a2342] text-white border-transparent" : "bg-white text-gray-500 border-gray-200"}`}>
                          {g.class.name}
                        </button>
                      );
                    })}
                  </div>
                  <SCard>
                    {groupAssignments.length === 0 ? (
                      <EmptyRow text="No assignments yet" />
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {groupAssignments.map((a: any) => {
                          const due = a.due_date ? new Date(a.due_date) : null;
                          const overdue = due && due < now;
                          return (
                            <div key={a._id} className="flex items-start gap-3 px-4 py-4">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${overdue ? "bg-red-50" : "bg-amber-50"}`}>
                                <FileText className={`w-4 h-4 ${overdue ? "text-red-500" : "text-amber-500"}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{a.class_subject_id?.subject_id?.name ?? "—"} · {a.class_subject_id?.class_id?.name ?? ""}</p>
                              </div>
                              {due && (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${overdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                                  {overdue ? "Overdue" : format(due, "MMM d")}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </SCard>
                </Sect>
              </div>
            )}

            {/* ══ ATTENDANCE ══ */}
            {activeTab === "attendance" && (
              <div className="space-y-5">
                <ClockInBtn hasMarked={hasMarkedToday} isPending={clockIn.isPending} hasProfile={!!teacherProfile} onMark={() => clockIn.mutate()} now={now} />

                {attendanceStudents.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Present", value: attPresent, bg: "bg-green-50", num: "text-green-700", sub: "text-green-400" },
                      { label: "Absent",  value: attAbsent,  bg: "bg-red-50",   num: "text-red-700",   sub: "text-red-400"  },
                      { label: "Late",    value: attLate,    bg: "bg-amber-50", num: "text-amber-700", sub: "text-amber-400"},
                    ].map(({ label, value, bg, num, sub }) => (
                      <div key={label} className={`${bg} rounded-2xl py-3 text-center`}>
                        <p className={`text-2xl font-extrabold ${num}`}>{value}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${sub} mt-0.5`}>{label}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Sect label="Select class">
                  {uniqueClasses.length === 0 ? (
                    <p className="text-sm text-gray-400 px-1">No classes assigned</p>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {uniqueClasses.map(cls => (
                        <button key={cls._id}
                          onClick={() => { setAttendanceClassId(cls._id); setAttendance({}); }}
                          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            attendanceClassId === cls._id ? "bg-[#0a2342] text-white border-transparent shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-[#0a2342]/30"
                          }`}>
                          <BookOpen className="w-3.5 h-3.5" />{cls.name}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${attendanceClassId === cls._id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{cls.level}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </Sect>

                {attendanceClassId && (
                  <Sect label={`Students · ${attendanceStudents.length} total`}>
                    <SCard>
                      {attendanceStudents.length === 0 ? (
                        <EmptyRow text="No students in this class" />
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {attendanceStudents.map((student: any, i: number) => {
                            const status = attendance[student._id] || "present";
                            return (
                              <motion.div key={student._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                className="flex items-center gap-3 px-4 py-3.5">
                                <div className="w-9 h-9 rounded-xl bg-[#0a2342]/10 flex items-center justify-center shrink-0">
                                  <span className="text-sm font-extrabold text-[#0a2342]">
                                    {getStudentName(student).charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{getStudentName(student)}</p>
                                  <p className="text-xs text-gray-400">{student.admission_number || "—"}</p>
                                </div>
                                <div className="flex gap-1.5 shrink-0">
                                  {(["P","A","L"] as const).map((lbl, li) => {
                                    const statuses = ["present","absent","late"];
                                    const colors: Record<string,{a:string;i:string}> = {
                                      P: { a:"bg-green-500 text-white border-green-500", i:"bg-white text-gray-300 border-gray-200 hover:border-green-300 hover:text-green-500" },
                                      A: { a:"bg-red-500 text-white border-red-500",     i:"bg-white text-gray-300 border-gray-200 hover:border-red-300 hover:text-red-500"   },
                                      L: { a:"bg-amber-500 text-white border-amber-500", i:"bg-white text-gray-300 border-gray-200 hover:border-amber-300 hover:text-amber-500"},
                                    };
                                    const active = status === statuses[li];
                                    return (
                                      <button key={lbl} onClick={() => setAttendance(p => ({ ...p, [student._id]: statuses[li] }))}
                                        className={`w-9 h-9 rounded-xl border-2 text-xs font-extrabold transition-all ${active ? colors[lbl].a : colors[lbl].i}`}>
                                        {lbl}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </SCard>
                    {attendanceStudents.length > 0 && (
                      <button onClick={handleSaveAttendance} disabled={markStudentAttendance.isPending}
                        className="w-full mt-3 py-4 rounded-2xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-60 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        {markStudentAttendance.isPending ? "Saving…" : "Save Attendance"}
                      </button>
                    )}
                  </Sect>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
        <div className="h-8" />
      </div>

      {/* Logout modal */}
      <AnimatePresence>
        {logoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
              <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-6">
                <div className="w-11 h-11 rounded-2xl bg-red-500/20 flex items-center justify-center mb-3">
                  <LogOut className="w-5 h-5 text-red-300" />
                </div>
                <h2 className="text-white font-extrabold text-lg">Sign out?</h2>
                <p className="text-white/50 text-sm mt-1">You'll need to log back in to access the teacher portal.</p>
              </div>
              <div className="px-6 py-5 flex gap-3">
                <button onClick={() => setLogoutModal(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => { logout(); navigate("/login"); }} className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold transition-colors">Yes, sign out</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Shared helpers ──────────────────────────────────────────────────────────
const ClockInBtn = ({ hasMarked, isPending, hasProfile, onMark, now }: { hasMarked: boolean; isPending: boolean; hasProfile: boolean; onMark: () => void; now: Date }) => (
  <button onClick={onMark} disabled={isPending || !hasProfile || hasMarked}
    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${hasMarked ? "bg-green-50 border-green-100 cursor-default" : "bg-[#0a2342] hover:bg-[#0d3460] border-transparent"}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasMarked ? "bg-green-100" : "bg-white/10"}`}>
        <CheckCircle2 className={`w-5 h-5 ${hasMarked ? "text-green-600" : "text-yellow-300"}`} />
      </div>
      <div className="text-left">
        <p className={`text-sm font-extrabold ${hasMarked ? "text-green-700" : "text-white"}`}>
          {isPending ? "Marking…" : hasMarked ? "Attendance marked for today" : "Clock in for today"}
        </p>
        <p className={`text-xs mt-0.5 ${hasMarked ? "text-green-500" : "text-white/40"}`}>
          {hasMarked ? `Marked · ${format(now, "h:mm a")}` : "Tap to mark your attendance"}
        </p>
      </div>
    </div>
    {!hasMarked && <ChevronRight className="w-4 h-4 text-white/40" />}
  </button>
);

const Sect = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{label}</p>
    {children}
  </div>
);
const SCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{children}</div>
);
const EmptyRow = ({ text }: { text: string }) => (
  <div className="px-4 py-10 text-center"><p className="text-sm text-gray-400">{text}</p></div>
);

export default TeacherDashboard;
