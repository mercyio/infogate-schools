import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  Plus,
  Save,
  Scissors,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

const LEVELS = ["Nursery", "Primary", "Secondary", "Vocational"] as const;
type Level = typeof LEVELS[number];

const WORK_DAYS = [
  { index: 1, label: "Mon", full: "Monday" },
  { index: 2, label: "Tue", full: "Tuesday" },
  { index: 3, label: "Wed", full: "Wednesday" },
  { index: 4, label: "Thu", full: "Thursday" },
  { index: 5, label: "Fri", full: "Friday" },
  { index: 6, label: "Sat", full: "Saturday" },
];

interface Subject {
  _id: string;
  name: string;
}

interface TimetableItem {
  _id: string;
  level: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  subject_id?: { _id?: string; name?: string };
}

interface Period {
  id: string;
  start: string;
  end: string;
}

// subject_id per cell; key = `${periodId}:${dayIndex}`
type Grid = Record<string, string>;
type Rooms = Record<string, string>;

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_META: Record<Level, { icon: typeof BookOpen; color: string; light: string; desc: string }> = {
  Nursery:    { icon: Layers,       color: "from-pink-500 to-rose-400",    light: "bg-pink-50 border-pink-200",   desc: "Early childhood classes" },
  Primary:    { icon: BookOpen,     color: "from-blue-600 to-blue-400",    light: "bg-blue-50 border-blue-200",   desc: "Primary school classes" },
  Secondary:  { icon: GraduationCap, color: "from-purple-600 to-violet-400", light: "bg-purple-50 border-purple-200", desc: "Secondary school classes" },
  Vocational: { icon: Wrench,       color: "from-amber-500 to-orange-400", light: "bg-amber-50 border-amber-200", desc: "Technical & vocational classes" },
};

const SUBJECT_PALETTE = [
  { bg: "bg-blue-100",   text: "text-blue-800",   border: "border-blue-300",   dot: "bg-blue-500" },
  { bg: "bg-green-100",  text: "text-green-800",  border: "border-green-300",  dot: "bg-green-500" },
  { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", dot: "bg-purple-500" },
  { bg: "bg-amber-100",  text: "text-amber-800",  border: "border-amber-300",  dot: "bg-amber-500" },
  { bg: "bg-rose-100",   text: "text-rose-800",   border: "border-rose-300",   dot: "bg-rose-500" },
  { bg: "bg-cyan-100",   text: "text-cyan-800",   border: "border-cyan-300",   dot: "bg-cyan-500" },
  { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", dot: "bg-indigo-500" },
  { bg: "bg-teal-100",   text: "text-teal-800",   border: "border-teal-300",   dot: "bg-teal-500" },
  { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", dot: "bg-orange-500" },
  { bg: "bg-lime-100",   text: "text-lime-800",   border: "border-lime-300",   dot: "bg-lime-500" },
];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function subjectColor(subjects: Subject[], subjectId: string) {
  const idx = subjects.findIndex((s) => s._id === subjectId);
  return SUBJECT_PALETTE[idx % SUBJECT_PALETTE.length] ?? SUBJECT_PALETTE[0];
}

// ─── Cell Picker ─────────────────────────────────────────────────────────────

function CellPicker({
  subjects,
  value,
  room,
  onChange,
  onRoomChange,
}: {
  subjects: Subject[];
  value: string;
  room: string;
  onChange: (id: string) => void;
  onRoomChange: (r: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowRoom(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = subjects.find((s) => s._id === value);
  const color = value ? subjectColor(subjects, value) : null;

  return (
    <div ref={ref} className="relative w-full h-full min-h-[60px]">
      {/* Cell display */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full h-full min-h-[60px] rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 group ${
          selected
            ? `${color!.bg} ${color!.border} ${color!.text}`
            : "border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        {selected ? (
          <>
            <span className="text-[11px] font-bold leading-tight text-center line-clamp-2">{selected.name}</span>
            {room && <span className="text-[9px] opacity-60 leading-none">{room}</span>}
          </>
        ) : (
          <Plus className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
        )}
      </button>

      {/* Dropdown picker */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ minWidth: "180px" }}
          >
            {/* Room input */}
            {showRoom ? (
              <div className="p-2 border-b">
                <div className="flex items-center gap-1">
                  <Input
                    autoFocus
                    placeholder="Room / location"
                    value={room}
                    onChange={(e) => onRoomChange(e.target.value)}
                    className="h-7 text-xs"
                  />
                  <button onClick={() => setShowRoom(false)} className="p-1 hover:bg-gray-100 rounded">
                    <Check className="w-3 h-3 text-green-600" />
                  </button>
                </div>
              </div>
            ) : null}

            {/* Clear */}
            {selected && (
              <button
                onClick={() => { onChange(""); onRoomChange(""); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-b"
              >
                <X className="w-3 h-3" /> Clear cell
              </button>
            )}

            {/* Room toggle */}
            {selected && !showRoom && (
              <button
                onClick={() => setShowRoom(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 border-b"
              >
                <Scissors className="w-3 h-3" /> {room ? "Edit room" : "Add room"}
              </button>
            )}

            {/* Subject list */}
            <div className="max-h-48 overflow-y-auto py-1">
              {subjects.map((s) => {
                const c = subjectColor(subjects, s._id);
                const active = s._id === value;
                return (
                  <button
                    key={s._id}
                    onClick={() => { onChange(s._id); setOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors ${
                      active ? `${c.bg} ${c.text}` : "hover:bg-gray-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                    <span className="truncate">{s.name}</span>
                    {active && <Check className="w-3 h-3 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TimetableManagement = () => {
  const queryClient = useQueryClient();

  // Phase: 'levels' = landing, 'editor' = grid editor
  const [phase, setPhase] = useState<"levels" | "editor">("levels");
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [grid, setGrid] = useState<Grid>({});
  const [rooms, setRooms] = useState<Rooms>({});
  const [dirty, setDirty] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: allTimetables = [], isLoading: loadingAll } = useQuery<TimetableItem[]>({
    queryKey: ["timetables"],
    queryFn: async () => {
      const res = await api.get("/timetables");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const { data: subjectsByLevel = [], isLoading: loadingSubjects } = useQuery<Subject[]>({
    queryKey: ["timetable-subjects-by-level", activeLevel],
    enabled: !!activeLevel,
    queryFn: async () => {
      const res = await api.get(`/timetables/subjects-by-level?level=${activeLevel}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Per-level entry counts for the landing cards
  const levelStats = useMemo(() => {
    const map: Record<string, number> = {};
    allTimetables.forEach((t) => {
      map[t.level] = (map[t.level] || 0) + 1;
    });
    return map;
  }, [allTimetables]);

  // ── Load existing timetable into grid when entering editor ─────────────────

  const loadLevelIntoGrid = useCallback(
    (level: string) => {
      const entries = allTimetables.filter((t) => t.level === level.toLowerCase());
      if (entries.length === 0) {
        // Start fresh: 5 blank periods
        setPeriods([
          { id: uid(), start: "08:00", end: "08:45" },
          { id: uid(), start: "08:45", end: "09:30" },
          { id: uid(), start: "09:30", end: "10:15" },
          { id: uid(), start: "10:30", end: "11:15" },
          { id: uid(), start: "11:15", end: "12:00" },
        ]);
        setGrid({});
        setRooms({});
        return;
      }

      // Extract unique time slots → periods
      const slotMap = new Map<string, { start: string; end: string }>();
      entries.forEach((e) => {
        const key = `${e.start_time}-${e.end_time}`;
        if (!slotMap.has(key)) slotMap.set(key, { start: e.start_time, end: e.end_time });
      });

      const builtPeriods: Period[] = Array.from(slotMap.values())
        .sort((a, b) => a.start.localeCompare(b.start))
        .map((s) => ({ id: `${s.start}-${s.end}`, start: s.start, end: s.end }));

      const builtGrid: Grid = {};
      const builtRooms: Rooms = {};
      entries.forEach((e) => {
        const periodId = `${e.start_time}-${e.end_time}`;
        const cellKey = `${periodId}:${e.day_of_week}`;
        if (e.subject_id?._id) builtGrid[cellKey] = e.subject_id._id;
        if (e.room_number) builtRooms[cellKey] = e.room_number;
      });

      setPeriods(builtPeriods);
      setGrid(builtGrid);
      setRooms(builtRooms);
    },
    [allTimetables]
  );

  const openEditor = (level: Level) => {
    setActiveLevel(level);
    loadLevelIntoGrid(level);
    setDirty(false);
    setPhase("editor");
  };

  const goBack = () => {
    setPhase("levels");
    setActiveLevel(null);
    setDirty(false);
  };

  // ── Period management ──────────────────────────────────────────────────────

  const addPeriod = () => {
    const last = periods[periods.length - 1];
    const newStart = last?.end || "08:00";
    const [h, m] = newStart.split(":").map(Number);
    const endMin = h * 60 + m + 45;
    const newEnd = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
    setPeriods((p) => [...p, { id: uid(), start: newStart, end: newEnd }]);
    setDirty(true);
  };

  const updatePeriod = (id: string, field: "start" | "end", val: string) => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
    setDirty(true);
  };

  const removePeriod = (id: string) => {
    // Also clear any grid cells that used this period
    setPeriods((p) => p.filter((x) => x.id !== id));
    setGrid((g) => {
      const next = { ...g };
      Object.keys(next).forEach((k) => { if (k.startsWith(`${id}:`)) delete next[k]; });
      return next;
    });
    setRooms((r) => {
      const next = { ...r };
      Object.keys(next).forEach((k) => { if (k.startsWith(`${id}:`)) delete next[k]; });
      return next;
    });
    setDirty(true);
  };

  // ── Grid cell management ───────────────────────────────────────────────────

  const setCell = (periodId: string, dayIdx: number, subjectId: string) => {
    const key = `${periodId}:${dayIdx}`;
    setGrid((g) => ({ ...g, [key]: subjectId }));
    setDirty(true);
  };

  const setRoom = (periodId: string, dayIdx: number, room: string) => {
    const key = `${periodId}:${dayIdx}`;
    setRooms((r) => ({ ...r, [key]: room }));
    setDirty(true);
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1. Delete all existing entries for this level
      await api.delete(`/timetables/level/${activeLevel}`);

      // 2. Build entries from grid
      const entries: any[] = [];
      periods.forEach((period) => {
        if (!period.start || !period.end || period.start >= period.end) return;
        WORK_DAYS.forEach((day) => {
          const key = `${period.id}:${day.index}`;
          const subjectId = grid[key];
          if (!subjectId) return;
          entries.push({
            level: activeLevel,
            subject_id: subjectId,
            day_of_week: day.index,
            start_time: period.start,
            end_time: period.end,
            room_number: rooms[key]?.trim() || undefined,
          });
        });
      });

      if (entries.length === 0) return { data: { total: 0 } };
      return api.post("/timetables/bulk", { entries });
    },
    onSuccess: async (res: any) => {
      const total = res?.data?.total ?? 0;
      toast.success(total > 0 ? `Timetable saved — ${total} slots.` : "Timetable cleared.");
      await queryClient.invalidateQueries({ queryKey: ["timetables"] });
      setDirty(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save timetable");
    },
  });

  // ── Subject color index (stable across renders) ────────────────────────────

  const subjectColorMap = useMemo(() => {
    const map: Record<string, typeof SUBJECT_PALETTE[0]> = {};
    subjectsByLevel.forEach((s, i) => {
      map[s._id] = SUBJECT_PALETTE[i % SUBJECT_PALETTE.length];
    });
    return map;
  }, [subjectsByLevel]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">

        {/* ─── PHASE 1: Level Cards ─────────────────────────────────────── */}
        {phase === "levels" && (
          <motion.div
            key="levels"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="container mx-auto px-4 py-8 space-y-8"
          >
            {/* Page header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] p-8 md:p-12 shadow-xl">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">Timetable Manager</h1>
                    <p className="text-white/60 text-sm mt-0.5">One timetable per school level, shared across all classes</p>
                  </div>
                </div>
                <div className="flex gap-6 mt-6">
                  {LEVELS.map((lvl) => {
                    const count = levelStats[lvl.toLowerCase()] || 0;
                    return (
                      <div key={lvl} className="text-center">
                        <div className="text-2xl font-extrabold text-white">{count}</div>
                        <div className="text-white/50 text-xs">{lvl}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Level cards */}
            {loadingAll ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {LEVELS.map((lvl, i) => {
                  const meta = LEVEL_META[lvl];
                  const Icon = meta.icon;
                  const count = levelStats[lvl.toLowerCase()] || 0;
                  const hasEntries = count > 0;

                  return (
                    <motion.div
                      key={lvl}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                    >
                      {/* Card top gradient */}
                      <div className={`h-2 bg-gradient-to-r ${meta.color}`} />
                      <div className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center mb-4 shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900">{lvl}</h3>
                        <p className="text-sm text-gray-400 mt-0.5">{meta.desc}</p>

                        <div className="mt-4 flex items-center gap-2">
                          {hasEntries ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              <Check className="w-3 h-3" /> {count} periods set
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                              Not configured
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => openEditor(lvl)}
                          className={`mt-5 w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            hasEntries
                              ? "bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white hover:opacity-90 shadow-md"
                              : "bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:opacity-90 shadow-md"
                          }`}
                        >
                          {hasEntries ? "Edit Timetable" : "Set Up Timetable"}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── PHASE 2: Grid Editor ─────────────────────────────────────── */}
        {phase === "editor" && activeLevel && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="flex flex-col h-screen"
          >
            {/* Editor toolbar */}
            <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${LEVEL_META[activeLevel].color} flex items-center justify-center`}>
                    {(() => { const Icon = LEVEL_META[activeLevel].icon; return <Icon className="w-4 h-4 text-white" />; })()}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 leading-none">{activeLevel} Timetable</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Shared across all {activeLevel} classes</p>
                  </div>
                </div>
                {dirty && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Unsaved changes</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Subject legend */}
                <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-lg">
                  {subjectsByLevel.map((s) => {
                    const c = subjectColorMap[s._id];
                    return (
                      <span key={s._id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        {s.name}
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveMutation.isPending ? "Saving…" : "Save Timetable"}
                </button>
              </div>
            </div>

            {/* Loading subjects */}
            {loadingSubjects && (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            {!loadingSubjects && subjectsByLevel.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
                <BookOpen className="w-14 h-14 opacity-30" />
                <div className="text-center">
                  <p className="font-semibold text-gray-600">No subjects found for {activeLevel}</p>
                  <p className="text-sm mt-1">Add subjects to classes under this level first, then return here.</p>
                </div>
                <button onClick={goBack} className="mt-2 px-5 py-2 bg-[#0a2342] text-white rounded-xl font-bold text-sm hover:opacity-90">
                  Go Back
                </button>
              </div>
            )}

            {!loadingSubjects && subjectsByLevel.length > 0 && (
              <div className="flex-1 overflow-auto p-4">
                <div className="min-w-[820px]">

                  {/* Grid */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Header row */}
                    <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: "180px repeat(6, 1fr)" }}>
                      <div className="px-4 py-3 flex items-center gap-2 border-r border-gray-100">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Period / Time</span>
                      </div>
                      {WORK_DAYS.map((day) => (
                        <div key={day.index} className="px-2 py-3 text-center border-r border-gray-100 last:border-r-0">
                          <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">{day.label}</div>
                          <div className="text-[10px] text-gray-400">{day.full}</div>
                        </div>
                      ))}
                    </div>

                    {/* Period rows */}
                    {periods.map((period, pIdx) => (
                      <div
                        key={period.id}
                        className="grid border-b border-gray-100 last:border-b-0 group/row"
                        style={{ gridTemplateColumns: "180px repeat(6, 1fr)" }}
                      >
                        {/* Period time cell */}
                        <div className="px-3 py-2 border-r border-gray-100 flex flex-col gap-1 bg-gray-50/60">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Period {pIdx + 1}</span>
                            <button
                              onClick={() => removePeriod(period.id)}
                              className="opacity-0 group-hover/row:opacity-100 p-0.5 hover:bg-red-100 rounded transition-all"
                              title="Remove period"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              value={period.start}
                              onChange={(e) => updatePeriod(period.id, "start", e.target.value)}
                              className="w-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                            />
                            <span className="text-gray-300 text-xs shrink-0">–</span>
                            <input
                              type="time"
                              value={period.end}
                              onChange={(e) => updatePeriod(period.id, "end", e.target.value)}
                              className="w-full text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        </div>

                        {/* Day cells */}
                        {WORK_DAYS.map((day) => {
                          const key = `${period.id}:${day.index}`;
                          return (
                            <div key={day.index} className="p-1.5 border-r border-gray-100 last:border-r-0">
                              <CellPicker
                                subjects={subjectsByLevel}
                                value={grid[key] || ""}
                                room={rooms[key] || ""}
                                onChange={(id) => setCell(period.id, day.index, id)}
                                onRoomChange={(r) => setRoom(period.id, day.index, r)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Add period row */}
                    <div
                      className="grid border-t border-dashed border-gray-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns: "180px repeat(6, 1fr)" }}
                      onClick={addPeriod}
                    >
                      <div className="px-4 py-3 col-span-7 flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-semibold">Add period</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile subject legend */}
                  <div className="lg:hidden mt-4 bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {subjectsByLevel.map((s) => {
                        const c = subjectColorMap[s._id];
                        return (
                          <span key={s._id} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
                            <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                            {s.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom save bar */}
                  <div className="mt-4 flex items-center justify-between bg-white rounded-xl border border-gray-100 px-5 py-3 shadow-sm">
                    <div className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-800">{Object.values(grid).filter(Boolean).length}</span> slots assigned
                      {" · "}
                      <span className="font-semibold text-gray-800">{periods.length}</span> periods
                    </div>
                    <button
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0a2342] to-[#1a5276] text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      {saveMutation.isPending ? "Saving…" : "Save Timetable"}
                    </button>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TimetableManagement;
