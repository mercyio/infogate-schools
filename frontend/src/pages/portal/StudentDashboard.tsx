import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, BookOpen, Calendar, Award, Bell, LogOut, FileText, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MODAL_DAYS = [
  { index: 1, label: "Monday" },
  { index: 2, label: "Tuesday" },
  { index: 3, label: "Wednesday" },
  { index: 4, label: "Thursday" },
  { index: 5, label: "Friday" },
  { index: 6, label: "Saturday" },
];

const dayHeaderClass = (dayIndex: number) => {
  switch (dayIndex) {
    case 1: return "bg-amber-100/70";
    case 2: return "bg-cyan-100/70";
    case 3: return "bg-indigo-100/70";
    case 4: return "bg-yellow-100/70";
    case 5: return "bg-green-100/70";
    case 6: return "bg-blue-100/70";
    default: return "bg-muted";
  }
};

interface TimetableItem {
  _id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  class_subject_id?: {
    subject_id?: { name?: string; code?: string };
    class_id?: { name?: string };
  };
}

interface AssignmentItem {
  _id: string;
  title: string;
  description?: string;
  due_date?: string;
  total_marks?: number;
  class_subject_id?: {
    subject_id?: { name?: string };
  };
}

interface DashboardData {
  class: { _id: string; name: string; level: string } | null;
  timetables: TimetableItem[];
  assignments: AssignmentItem[];
}

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [showTimetable, setShowTimetable] = useState(false);

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      const res = await api.get("/reports/student/dashboard");
      return res.data;
    },
  });

  const todayDayIndex = new Date().getDay(); // 0=Sun…6=Sat

  const todaysClasses = useMemo(
    () => (data?.timetables || []).filter((t) => t.day_of_week === todayDayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [data, todayDayIndex]
  );

  // Grid helpers
  const modalSlots = useMemo(() => {
    const unique = new Map<string, { key: string; start: string; end: string }>();
    (data?.timetables || []).forEach((item) => {
      const key = `${item.start_time}-${item.end_time}`;
      if (!unique.has(key)) unique.set(key, { key, start: item.start_time, end: item.end_time });
    });
    return Array.from(unique.values()).sort((a, b) => a.start.localeCompare(b.start));
  }, [data]);

  const getItemsForCell = (dayIndex: number, slotKey: string) =>
    (data?.timetables || []).filter(
      (item) => item.day_of_week === dayIndex && `${item.start_time}-${item.end_time}` === slotKey
    );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-student rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-student-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Student Portal</h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Greeting + class badge */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold">
              Hey, {user?.name?.split(" ")[0] || "Student"}! 🎒 Ready to learn?
            </h2>
            {data?.class && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                {data.class.name}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Assignments", value: data?.assignments.length ?? "—", icon: FileText, color: "bg-coral" },
              { label: "Today's Classes", value: todaysClasses.length, icon: Calendar, color: "bg-student" },
              { label: "Average Grade", value: "—", icon: Award, color: "bg-accent" },
              { label: "Class", value: data?.class?.name ?? "—", icon: BookOpen, color: "bg-lavender" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="playful-card p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-card" />
                </div>
                <p className="text-2xl font-extrabold truncate">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Classes */}
            <div className="playful-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">📅 Today's Classes</h3>
                <span className="text-xs text-muted-foreground">{DAYS[todayDayIndex]}</span>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground p-3">Loading…</p>
              ) : todaysClasses.length > 0 ? (
                <div className="space-y-2">
                  {todaysClasses.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-semibold">{item.start_time} – {item.end_time}</span>
                        <span className="text-sm">{item.class_subject_id?.subject_id?.name ?? "—"}</span>
                      </div>
                      {item.room_number && (
                        <span className="text-xs text-muted-foreground">{item.room_number}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3">No classes scheduled for today.</p>
              )}
              <Button variant="outline" size="sm" className="mt-4 gap-2 w-full" onClick={() => setShowTimetable(true)}>
                <Eye className="w-4 h-4" /> View Full Timetable
              </Button>
            </div>

            {/* Assignments */}
            <div className="playful-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">📝 Assignments</h3>
                <Link to="/portal/student/assignments">
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground p-3">Loading…</p>
              ) : (data?.assignments.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {(data?.assignments ?? []).slice(0, 3).map((item) => (
                    <Link key={item._id} to="/portal/student/assignments">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.class_subject_id?.subject_id?.name}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-coral/10 text-coral rounded-full font-semibold shrink-0">
                          {item.due_date ? format(new Date(item.due_date), "MMM d") : "No date"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3">No assignments yet.</p>
              )}
              <Link to="/portal/student/assignments">
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  View all assignments
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Timetable Modal */}
      <Dialog open={showTimetable} onOpenChange={setShowTimetable}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{data?.class?.name ?? "Class"} Timetable</DialogTitle>
            <DialogDescription>Weekly timetable for your class.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border overflow-hidden bg-card overflow-x-auto">
            <div className="text-center py-4 border-b bg-primary/5">
              <h4 className="text-3xl font-extrabold tracking-tight text-primary">Timetable</h4>
            </div>
            <table className="w-full min-w-[980px]">
              <thead>
                <tr>
                  <th className="text-center text-xs font-bold px-2 py-3 bg-muted w-[60px]">#</th>
                  <th className="text-center text-xs font-bold px-3 py-3 bg-muted w-[130px]">Time</th>
                  {MODAL_DAYS.map((day) => (
                    <th key={day.index} className={`text-center text-xs font-bold px-3 py-3 border-l ${dayHeaderClass(day.index)}`}>
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modalSlots.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No timetable entries for your class yet.
                    </td>
                  </tr>
                ) : (
                  modalSlots.map((slot, i) => (
                    <tr key={slot.key} className="border-t align-top">
                      <td className="text-center px-2 py-3 text-2xl font-bold text-muted-foreground">{i + 1}</td>
                      <td className="text-center px-3 py-3 text-xs font-semibold bg-muted/50">
                        {slot.start} - {slot.end}
                      </td>
                      {MODAL_DAYS.map((day) => {
                        const cells = getItemsForCell(day.index, slot.key);
                        return (
                          <td key={`${slot.key}-${day.index}`} className="px-2 py-2 border-l">
                            {cells.length === 0 ? (
                              <div className="h-16 rounded-md bg-background/60" />
                            ) : (
                              <div className="space-y-1">
                                {cells.map((item) => (
                                  <div key={item._id} className="rounded-md border bg-background p-2">
                                    <p className="text-xs font-semibold leading-snug">
                                      {item.class_subject_id?.subject_id?.name ?? "—"}
                                    </p>
                                    {item.room_number && (
                                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.room_number}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default StudentDashboard;
