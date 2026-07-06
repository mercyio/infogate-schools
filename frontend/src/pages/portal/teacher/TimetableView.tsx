import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, CalendarDays, Layers3, Sparkles } from "lucide-react";
import api from "@/lib/api";
import TeacherSubPageLayout from "@/components/layout/TeacherSubPageLayout";

const DAYS = [
  { index: 1, label: "Mon", full: "Monday", bg: "bg-blue-100/60" },
  { index: 2, label: "Tue", full: "Tuesday", bg: "bg-emerald-100/60" },
  { index: 3, label: "Wed", full: "Wednesday", bg: "bg-purple-100/60" },
  { index: 4, label: "Thu", full: "Thursday", bg: "bg-rose-100/60" },
  { index: 5, label: "Fri", full: "Friday", bg: "bg-orange-100/60" },
];

interface TimetableItem {
  _id: string;
  level: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject_id?: { _id?: string; name?: string; code?: string };
}

interface GroupedStudent {
  class: { _id: string; name: string; level?: string };
  subject: { _id?: string; name: string };
  students: any[];
}

export default function TimetableView() {
  const now = new Date();
  const todayIndex = now.getDay();
  const curMin = now.getHours() * 60 + now.getMinutes();
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const normalizeLevel = (lv?: string) => (lv === "creche" ? "nursery" : (lv || "")).toLowerCase();

  const { data: teacherProfile } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: async () => { const r = await api.get("/users/me/teacher"); return r.data; },
  });

  const { data: groups = [], isLoading: loadingGroups } = useQuery<GroupedStudent[]>({
    queryKey: ["teacher-groups"],
    queryFn: async () => { const r = await api.get("/users/teacher/students/grouped"); return r.data || []; },
  });

  const assignedClasses: Array<{ _id: string; name: string; level?: string }> = useMemo(() => {
    return teacherProfile?.assigned_classes?.length
      ? teacherProfile.assigned_classes
      : teacherProfile?.assigned_class
        ? [teacherProfile.assigned_class]
        : [];
  }, [teacherProfile]);

  const groupedClasses = useMemo(() => {
    const map = new Map<string, GroupedStudent["class"]>();
    groups.forEach(g => {
      if (g.class && !map.has(g.class._id)) {
        map.set(g.class._id, g.class);
      }
    });
    return Array.from(map.values());
  }, [groups]);

  const classesToShow = assignedClasses.length > 0 ? assignedClasses : groupedClasses;

  const selectedClasses = useMemo(() => {
    if (selectedClassId === "all") return classesToShow;
    return classesToShow.filter(cls => String(cls._id) === selectedClassId);
  }, [classesToShow, selectedClassId]);

  const uniqueLevels = useMemo(() => {
    return [...new Set(classesToShow.map(cls => normalizeLevel(cls.level)).filter(Boolean))] as string[];
  }, [classesToShow]);

  const { data: timetables = [], isLoading: loadingTT } = useQuery<TimetableItem[]>({
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

  const isLoading = loadingGroups || loadingTT;

  return (
    <TeacherSubPageLayout
      title="Timetable"
      subtitle="Full weekly schedule per class"
    >
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading timetable…</div>
      ) : classesToShow.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400">No classes linked to your account</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              <Layers3 className="h-3.5 w-3.5" />
              Toggle Classes
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedClassId("all")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedClassId === "all" ? "bg-[#0a2342] text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                All Classes
              </button>
              {classesToShow.map(cls => {
                const active = selectedClassId === String(cls._id);
                return (
                  <button
                    key={cls._id}
                    type="button"
                    onClick={() => setSelectedClassId(String(cls._id))}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${active ? "bg-amber-400 text-slate-950 shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedClasses.map(cls => {
            const classLevel = normalizeLevel(cls.level);
            const classSlots = timetables.filter(t => normalizeLevel(t.level) === classLevel);
            if (classSlots.length === 0) return null;

            return (
              <div key={cls._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                <div className="bg-gradient-to-r from-[#0a2342] via-[#0d3460] to-[#1a5276] px-5 py-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Class Schedule
                      </div>
                      <h3 className="mt-3 text-2xl font-black tracking-tight">{cls.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-white/60">{classLevel}</p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/75">{classSlots.length} periods</span>
                      <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-950">Weekly view</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100 bg-slate-50/40">
                  {DAYS.map(day => {
                    const daySlots = classSlots.filter(t => t.day_of_week === day.index).sort((a, b) => a.start_time.localeCompare(b.start_time));
                    const isToday = day.index === todayIndex;

                    return (
                      <div key={day.index} className={`p-4 md:p-5 ${isToday ? "bg-amber-50/60 border-l-[6px] border-amber-400" : day.bg}`}>
                        <div className="mb-3 flex items-center gap-2">
                          <h4 className={`text-sm font-extrabold tracking-tight ${isToday ? "text-amber-900" : "text-slate-900"}`}>{day.full}</h4>
                          {isToday && <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-950 shadow-sm">Today</span>}
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? "text-amber-700/60" : "text-slate-400"}`}>{daySlots.length} periods</span>
                        </div>
                        
                        {daySlots.length === 0 ? (
                          <p className="text-xs italic text-slate-400">No periods scheduled</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {daySlots.map((t, i) => {
                              const subName = t.subject_id?.name ?? "—";
                              const isBreak = subName.toLowerCase().includes("lunch") || subName.toLowerCase().includes("break");
                              const isAssembly = subName.toLowerCase().includes("assembly");
                              const [sh, sm] = t.start_time.split(":").map(Number);
                              const [eh, em] = t.end_time.split(":").map(Number);
                              const start = sh * 60 + sm, end = eh * 60 + em;
                              const isNow = isToday && curMin >= start && curMin < end;
                              
                              return (
                                <div key={t._id} className={`group flex flex-col rounded-2xl border p-4 transition-all ${isNow ? "border-emerald-200 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}>
                                  <div className="mb-3 flex items-start justify-between gap-3">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">Period {i + 1}</span>
                                    {isNow && <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white">Now</span>}
                                  </div>
                                  <p className={`text-sm font-extrabold tracking-tight truncate ${isBreak ? "text-amber-700" : isAssembly ? "text-blue-700" : "text-slate-900"}`}>
                                    {subName}
                                  </p>
                                  <div className="mt-3 flex items-center gap-2 pt-2 text-slate-500">
                                    <Clock className="h-3.5 w-3.5" />
                                    <p className="text-xs font-medium">{t.start_time} - {t.end_time}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {selectedClasses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
              No timetable entries for the selected class.
            </div>
          )}
        </div>
      )}
    </TeacherSubPageLayout>
  );
}
