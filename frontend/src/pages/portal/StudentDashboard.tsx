import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut, BookOpen, FileText, Award,
  ChevronRight, User, Home, ClipboardList,
  CheckCircle, AlertCircle, XCircle, Upload,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format, isPast } from "date-fns";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TABS = [
  { key: "home",        label: "Home",       icon: Home          },
  { key: "assignments", label: "Assignments", icon: ClipboardList },
  { key: "results",     label: "Results",    icon: Award         },
  { key: "attendance",  label: "Attendance", icon: CheckCircle   },
  { key: "info",        label: "Info",       icon: User          },
] as const;
type Tab = typeof TABS[number]["key"];

interface TimetableItem {
  _id: string; level: string; day_of_week: number;
  start_time: string; end_time: string; room_number?: string;
  subject_id?: { name?: string; code?: string };
}
interface AssignmentItem {
  _id: string; title: string; description?: string;
  due_date?: string; total_marks?: number;
  class_subject_id?: { subject_id?: { name?: string } };
}
interface DashboardData {
  class: { _id: string; name: string; level: string } | null;
  timetables: TimetableItem[];
  assignments: AssignmentItem[];
}

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [activeTab, setActiveTab]       = useState<Tab>("home");
  const [logoutModal, setLogoutModal]   = useState(false);
  const [submitTarget, setSubmitTarget] = useState<AssignmentItem | null>(null);
  const [submitFile, setSubmitFile]     = useState<File | null>(null);
  const [submitNote, setSubmitNote]     = useState("");

  const displayName = (user as any)?.full_name ?? user?.name ?? "Student";
  const initials    = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const todayIndex  = new Date().getDay();
  const now         = new Date();
  const curMin      = now.getHours() * 60 + now.getMinutes();

  // Dashboard (class + assignments)
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["student-dashboard"],
    queryFn: async () => { const r = await api.get("/reports/student/dashboard"); return r.data; },
  });

  // Timetable
  const timetableLevel = data?.class?.level === "creche" ? "nursery" : data?.class?.level;
  const { data: timetables = [] } = useQuery<TimetableItem[]>({
    queryKey: ["student-timetable", timetableLevel],
    enabled: !!timetableLevel,
    queryFn: async () => { const r = await api.get(`/timetables?level=${timetableLevel}`); return Array.isArray(r.data) ? r.data : []; },
  });

  // Student profile (results + info)
  const { data: profile } = useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const r = await api.get("/users/me/student");
      return r.data;
    },
  });

  // Attendance
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ["student-attendance"],
    enabled: activeTab === "attendance",
    queryFn: async () => {
      if (!profile?._id) return [];
      const r = await api.get(`/attendance?student_id=${profile._id}`);
      return Array.isArray(r.data) ? r.data : [];
    },
  });

  // Submit assignment mutation
  const submitMutation = useMutation({
    mutationFn: async ({ id, file, note }: { id: string; file: File; note: string }) => {
      const fd = new FormData();
      fd.append("file", file);
      if (note) fd.append("notes", note);
      return api.post(`/assignments/${id}/submit`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["student-dashboard"] });
      setSubmitTarget(null);
      setSubmitFile(null);
      setSubmitNote("");
    },
  });

  const todaysClasses = useMemo(
    () => timetables.filter(t => t.day_of_week === todayIndex).sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [timetables, todayIndex]
  );

  const present = attendanceRecords.filter((r: any) => r.status === "present").length;
  const late    = attendanceRecords.filter((r: any) => r.status === "late").length;
  const absent  = attendanceRecords.filter((r: any) => r.status === "absent").length;
  const totalDays = attendanceRecords.length;
  const attendanceRate = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0;

  const academicResults: any[] = Array.isArray(profile?.academic_performance) ? profile.academic_performance : [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Header ── */}
      <div className="relative bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-0 w-52 h-52 rounded-full bg-white/5" />

        <div className="relative z-10 container mx-auto px-6 max-w-2xl">

          {/* Top bar */}
          <div className="flex items-center justify-between pt-6 pb-8">
            <div className="flex items-center gap-3">
              <img src="/infogate-school-badge.svg" alt="Infogate" className="h-10 w-auto opacity-90" />
              <div>
                <p className="text-white font-extrabold text-sm leading-tight">Student Portal</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Infogate Schools</p>
              </div>
            </div>
            <button
              onClick={() => setLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-colors border border-white/10"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>

          {/* Student greeting */}
          <div className="flex items-end gap-5 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center text-gray-900 font-extrabold text-2xl shadow-lg shrink-0">
              {initials}
            </div>
            <div className="pb-0.5">
              <p className="text-white/40 text-xs font-semibold mb-0.5">
                {now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening"}
              </p>
              <h1 className="text-3xl font-extrabold text-white leading-none tracking-tight">{displayName}</h1>
              {data?.class && (
                <span className="inline-flex items-center mt-2 text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/15 uppercase tracking-wide gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  {data.class.name} · {data.class.level}
                </span>
              )}
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex overflow-x-auto no-scrollbar -mx-6 px-6 gap-0">
            {TABS.map(tab => {
              const Icon   = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 shrink-0 px-4 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                    active
                      ? "border-yellow-400 text-white"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="container mx-auto px-5 py-6 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >

            {/* ══ HOME ══ */}
            {activeTab === "home" && (
              <div className="space-y-5">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin h-10 w-10 border-4 border-[#0a2342] border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <>
                    {/* Today's Classes */}
                    <Sect label={`Today · ${DAYS[todayIndex]}`}>
                      <SCard>
                        <SCardHeader icon={<BookOpen className="w-4 h-4 text-blue-600" />} iconBg="bg-blue-50"
                          title="Today's classes" sub={`${todaysClasses.length} period${todaysClasses.length !== 1 ? "s" : ""}`} />
                        {todaysClasses.length === 0 ? (
                          <EmptyRow text="No classes scheduled today" />
                        ) : (
                          <div className="divide-y divide-gray-50">
                            {todaysClasses.map(t => <ClassRow key={t._id} t={t} curMin={curMin} todayIndex={todayIndex} />)}
                          </div>
                        )}
                      </SCard>
                    </Sect>

                    {/* Weekly Timetable */}
                    <Sect label="Weekly timetable">
                      <TimetableCard timetables={timetables} todayIndex={todayIndex} />
                    </Sect>
                  </>
                )}
              </div>
            )}

            {/* ══ ASSIGNMENTS ══ */}
            {activeTab === "assignments" && (
              <div className="space-y-5">
                <Sect label={`Class assignments · ${data?.assignments.length ?? 0} total`}>
                  <SCard>
                    {(data?.assignments.length ?? 0) === 0 ? (
                      <EmptyRow text="No assignments posted yet" />
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {(data?.assignments ?? []).map(a => {
                          const due     = a.due_date ? new Date(a.due_date) : null;
                          const overdue = due && isPast(due);
                          return (
                            <div key={a._id} className="px-4 py-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${overdue ? "bg-red-50" : "bg-amber-50"}`}>
                                  <FileText className={`w-4 h-4 ${overdue ? "text-red-500" : "text-amber-600"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-bold text-gray-900">{a.title}</p>
                                    {due && (
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${overdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                                        {overdue ? "Overdue" : format(due, "MMM d")}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">{a.class_subject_id?.subject_id?.name ?? "—"}</p>
                                  {a.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{a.description}</p>}
                                  {a.total_marks && <p className="text-xs text-gray-400 mt-1">Total marks: <span className="font-bold text-gray-600">{a.total_marks}</span></p>}
                                </div>
                              </div>
                              <button
                                onClick={() => setSubmitTarget(a)}
                                className="mt-3 ml-12 flex items-center gap-1.5 text-xs font-bold text-[#0a2342] hover:opacity-70 transition-opacity"
                              >
                                <Upload className="w-3.5 h-3.5" /> Submit assignment
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </SCard>
                </Sect>
              </div>
            )}

            {/* ══ RESULTS ══ */}
            {activeTab === "results" && (
              <div className="space-y-5">
                {academicResults.length === 0 ? (
                  <SCard><EmptyRow text="No results recorded yet" /></SCard>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0a2342] rounded-2xl p-5">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">GPA</p>
                        <p className="text-4xl font-extrabold text-white">{(Number(profile?.gpa) || 0).toFixed(1)}</p>
                        <p className="text-white/30 text-xs mt-1">Current term</p>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5">
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Overall grade</p>
                        <p className="text-4xl font-extrabold text-[#0a2342]">{profile?.grade || profile?.gradeLevel || "—"}</p>
                        <p className="text-gray-300 text-xs mt-1">This session</p>
                      </div>
                    </div>

                    <Sect label="Subject performance">
                      <SCard>
                        <div className="divide-y divide-gray-50">
                          {academicResults.map((r: any, i: number) => {
                            const score  = Number(r.score) || 0;
                            const grade  = r.grade || (score >= 70 ? "B" : score >= 60 ? "C" : "F");
                            const color  = score >= 70
                              ? { bar: "bg-green-500", badge: "bg-green-50 text-green-700", num: "text-green-700" }
                              : score >= 50
                              ? { bar: "bg-amber-400", badge: "bg-amber-50 text-amber-700", num: "text-amber-700" }
                              : { bar: "bg-red-400",   badge: "bg-red-50 text-red-600",     num: "text-red-600"   };
                            return (
                              <div key={i} className="px-4 py-3.5">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-bold text-gray-900">{r.subject || "—"}</p>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-sm font-extrabold ${color.num}`}>{score}<span className="text-xs text-gray-300">/100</span></span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color.badge}`}>{grade}</span>
                                  </div>
                                </div>
                                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, score)}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                                    className={`h-full rounded-full ${color.bar}`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </SCard>
                    </Sect>
                  </>
                )}
              </div>
            )}

            {/* ══ ATTENDANCE ══ */}
            {activeTab === "attendance" && (
              <div className="space-y-5">
                <SCard>
                  {totalDays === 0 ? (
                    <EmptyRow text="No attendance records yet" />
                  ) : (
                    <>
                      <div className="px-4 pt-4 pb-3">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Present", count: present, bg: "bg-green-50", num: "text-green-800", sub: "text-green-600" },
                            { label: "Late",    count: late,    bg: "bg-amber-50", num: "text-amber-800", sub: "text-amber-600" },
                            { label: "Absent",  count: absent,  bg: "bg-red-50",   num: "text-red-700",   sub: "text-red-500"  },
                          ].map(({ label, count, bg, num, sub }) => (
                            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                              <p className={`text-2xl font-extrabold ${num}`}>{count}</p>
                              <p className={`text-xs font-bold mt-0.5 ${sub}`}>{label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${attendanceRate}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${attendanceRate >= 80 ? "bg-green-500" : attendanceRate >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-xs text-gray-400">Attendance rate</span>
                          <span className="text-xs font-bold text-gray-700">{attendanceRate}%</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-50 px-4 pt-3 pb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Records</p>
                        <div className="divide-y divide-gray-50">
                          {[...attendanceRecords]
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((r: any, i: number) => {
                              const cfg: Record<string, { dot: string; tag: string; label: string }> = {
                                present: { dot: "bg-green-500", tag: "bg-green-50 text-green-700", label: "Present" },
                                late:    { dot: "bg-amber-400", tag: "bg-amber-50 text-amber-700", label: "Late"    },
                                absent:  { dot: "bg-red-400",   tag: "bg-red-50 text-red-600",     label: "Absent"  },
                              };
                              const c = cfg[r.status] ?? cfg.absent;
                              return (
                                <div key={i} className="flex items-center gap-3 py-2.5">
                                  <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                  <p className="flex-1 text-sm text-gray-600">
                                    {r.date ? format(new Date(r.date), "EEE, MMM d yyyy") : "—"}
                                  </p>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tag}`}>{c.label}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}
                </SCard>
              </div>
            )}

            {/* ══ INFO ══ */}
            {activeTab === "info" && (
              <div className="space-y-5">
                <Sect label="Student details">
                  <SCard>
                    <div className="divide-y divide-gray-50">
                      {[
                        { label: "Full name",        value: (profile?.user_id as any)?.full_name ?? displayName },
                        { label: "Admission number", value: profile?.admission_number },
                        { label: "Class",            value: (profile?.class_id as any)?.name },
                        { label: "Level",            value: (profile?.class_id as any)?.level },
                        { label: "Gender",           value: (profile?.user_id as any)?.gender ?? profile?.gender },
                        { label: "Date of birth",    value: profile?.date_of_birth ? String(profile.date_of_birth).split("T")[0] : null },
                        { label: "Address",          value: profile?.address },
                      ].filter(f => f.value).map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between px-4 py-3.5">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{label}</p>
                          <p className="text-sm font-bold text-gray-900 capitalize text-right max-w-[55%] truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                  </SCard>
                </Sect>

                {(profile?.parent_name || profile?.parent_phone || profile?.parent_email) && (
                  <Sect label="Parent / guardian">
                    <SCard>
                      <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-50">
                        <div className="w-10 h-10 rounded-full bg-[#0a2342] flex items-center justify-center shrink-0">
                          <span className="text-sm font-extrabold text-white">
                            {profile?.parent_name ? profile.parent_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "P"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{profile?.parent_name ?? "Guardian"}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Parent / Guardian</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {[
                          { label: "Phone", value: profile?.parent_phone },
                          { label: "Email", value: profile?.parent_email },
                        ].filter(f => f.value).map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between px-4 py-3">
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-bold text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </SCard>
                  </Sect>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
        <div className="h-8" />
      </div>

      {/* ── Submit Assignment Modal ── */}
      <AnimatePresence>
        {submitTarget && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-5">
                <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-yellow-300" />
                </div>
                <h2 className="text-white font-extrabold text-base leading-tight">{submitTarget.title}</h2>
                <p className="text-white/40 text-xs mt-1">{submitTarget.class_subject_id?.subject_id?.name ?? "Assignment"}</p>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Attach file</label>
                  <input
                    type="file"
                    onChange={e => setSubmitFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0a2342] file:text-white hover:file:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={submitNote}
                    onChange={e => setSubmitNote(e.target.value)}
                    placeholder="Any notes for your teacher…"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0a2342]/30"
                  />
                </div>
                {submitMutation.isError && (
                  <p className="text-xs text-red-600 font-semibold">Submission failed. Please try again.</p>
                )}
                {submitMutation.isSuccess && (
                  <p className="text-xs text-green-600 font-semibold">Submitted successfully!</p>
                )}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setSubmitTarget(null); setSubmitFile(null); setSubmitNote(""); }}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    disabled={!submitFile || submitMutation.isPending}
                    onClick={() => submitFile && submitMutation.mutate({ id: submitTarget._id, file: submitFile, note: submitNote })}
                    className="flex-1 py-3 rounded-2xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-40 text-white text-sm font-extrabold transition-colors"
                  >
                    {submitMutation.isPending ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Logout Modal ── */}
      <AnimatePresence>
        {logoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#0a2342] to-[#1a5276] px-6 py-6">
                <div className="w-11 h-11 rounded-2xl bg-red-500/20 flex items-center justify-center mb-3">
                  <LogOut className="w-5 h-5 text-red-300" />
                </div>
                <h2 className="text-white font-extrabold text-lg">Sign out?</h2>
                <p className="text-white/50 text-sm mt-1">You'll need to log back in to access the student portal.</p>
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

// ── Shared helpers ─────────────────────────────────────────────────────────────

const Sect = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{label}</p>
    {children}
  </div>
);

const SCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{children}</div>
);

const SCardHeader = ({ icon, iconBg, title, sub, action }: {
  icon: React.ReactNode; iconBg: string; title: string; sub?: string; action?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
    <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
);

const EmptyRow = ({ text }: { text: string }) => (
  <div className="px-4 py-10 text-center"><p className="text-sm text-gray-400">{text}</p></div>
);

const ClassRow = ({ t, curMin, todayIndex }: { t: any; curMin: number; todayIndex: number }) => {
  const name       = t.subject_id?.name ?? "—";
  const isBreak    = name.toLowerCase().includes("lunch") || name.toLowerCase().includes("break");
  const isAssembly = name.toLowerCase().includes("assembly");
  const [sh, sm]   = t.start_time.split(":").map(Number);
  const [eh, em]   = t.end_time.split(":").map(Number);
  const start = sh * 60 + sm;
  const end   = eh * 60 + em;
  const day   = new Date().getDay();
  const isNow  = curMin >= start && curMin < end && day === todayIndex;
  const isDone = curMin >= end   && day === todayIndex;
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="w-16 shrink-0">
        <p className="text-xs text-gray-400 leading-tight">{t.start_time}</p>
        <p className="text-xs text-gray-300 leading-tight">{t.end_time}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isBreak ? "text-amber-700" : isAssembly ? "text-blue-700" : "text-gray-900"}`}>{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{isBreak ? "Break" : isAssembly ? "All school" : "Subject"}</p>
      </div>
      {isNow  && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">Now</span>}
      {isDone && !isNow && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 shrink-0">Done</span>}
      {isBreak && !isNow && !isDone && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">Break</span>}
    </div>
  );
};

const TimetableCard = ({ timetables, todayIndex }: { timetables: any[]; todayIndex: number }) => (
  <SCard>
    {timetables.length === 0 ? (
      <EmptyRow text="No timetable set yet" />
    ) : (
      <div className="divide-y divide-gray-100">
        {["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day, i) => {
          const dayNum  = i + 1;
          const isToday = dayNum === todayIndex;
          const slots   = timetables.filter(t => t.day_of_week === dayNum).sort((a, b) => a.start_time.localeCompare(b.start_time));
          return (
            <div key={day} className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-[#0a2342]" : "text-gray-400"}`}>{day}</p>
                {isToday && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Today</span>}
              </div>
              {slots.length === 0 ? <p className="text-xs text-gray-300">No classes</p> : (
                <div className="space-y-1">
                  {slots.map(s => {
                    const sname      = s.subject_id?.name ?? "—";
                    const isBreak    = sname.toLowerCase().includes("lunch") || sname.toLowerCase().includes("break");
                    const isAssembly = sname.toLowerCase().includes("assembly");
                    return (
                      <div key={s._id} className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg ${isBreak ? "bg-amber-50" : isAssembly ? "bg-blue-50" : "bg-gray-50"}`}>
                        <span className="text-[11px] text-gray-400 w-20 shrink-0">{s.start_time} – {s.end_time}</span>
                        <span className={`text-xs font-bold ${isBreak ? "text-amber-700" : isAssembly ? "text-blue-700" : "text-gray-800"}`}>{sname}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </SCard>
);

export default StudentDashboard;
