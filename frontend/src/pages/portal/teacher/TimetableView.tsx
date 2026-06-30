import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/api";

const MODAL_DAYS = [
  { index: 1, label: "Monday" },
  { index: 2, label: "Tuesday" },
  { index: 3, label: "Wednesday" },
  { index: 4, label: "Thursday" },
  { index: 5, label: "Friday" },
  { index: 6, label: "Saturday" },
];

interface TimetableItem {
  _id: string;
  level: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  subject_id?: { _id?: string; name?: string; code?: string };
}

interface GroupedStudent {
  class: { _id: string; name: string; level?: string };
  subject: { _id?: string; name: string };
  class_subject_id: string | null;
  students: any[];
}

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

export default function TimetableView() {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: groupedStudents = [], isLoading: loadingGroups } = useQuery<GroupedStudent[]>({
    queryKey: ["teacher-students-grouped"],
    queryFn: async () => {
      const res = await api.get("/users/teacher/students/grouped");
      return res.data;
    },
  });

  // Derive the teacher's level from any of their linked classes
  const teacherLevel = useMemo(() => {
    const first = groupedStudents[0];
    return (first?.class as any)?.level as string | undefined;
  }, [groupedStudents]);

  const { data: timetables = [], isLoading: loadingTimetables } = useQuery<TimetableItem[]>({
    queryKey: ["timetables-level", teacherLevel],
    enabled: !!teacherLevel,
    queryFn: async () => {
      const res = await api.get(`/timetables?level=${teacherLevel}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const modalSlots = useMemo(() => {
    const unique = new Map<string, { key: string; start: string; end: string }>();
    timetables.forEach((item) => {
      const key = `${item.start_time}-${item.end_time}`;
      if (!unique.has(key)) unique.set(key, { key, start: item.start_time, end: item.end_time });
    });
    return Array.from(unique.values()).sort((a, b) => a.start.localeCompare(b.start));
  }, [timetables]);

  const getItemsForCell = (dayIndex: number, slotKey: string) =>
    timetables.filter(
      (item) => item.day_of_week === dayIndex && `${item.start_time}-${item.end_time}` === slotKey
    );

  const isLoading = loadingGroups || loadingTimetables;
  const activeDays = useMemo(
    () => new Set(timetables.map((t) => t.day_of_week)).size,
    [timetables]
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">My Timetable</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {teacherLevel ? `Showing ${teacherLevel} level timetable` : "View your level's timetable"}
        </p>
      </motion.div>

      {isLoading && (
        <div className="py-20 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {!isLoading && !teacherLevel && (
        <div className="playful-card p-10 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 opacity-40" size={36} />
          <p>No classes linked to your account.</p>
        </div>
      )}

      {!isLoading && teacherLevel && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="playful-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-base md:text-lg">{teacherLevel} Level</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {timetables.length} periods • {activeDays} active days
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setModalOpen(true)}>
              <Eye className="w-4 h-4" /> View
            </Button>
          </div>
        </motion.div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{teacherLevel} Level Timetable</DialogTitle>
            <DialogDescription>Weekly timetable arranged as rows and columns.</DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border overflow-hidden bg-card overflow-x-auto">
            <div className="text-center py-4 border-b bg-primary/5">
              <h4 className="text-3xl font-extrabold tracking-tight text-primary">Timetable</h4>
            </div>
            <table className="w-full min-w-[980px]">
              <thead>
                <tr>
                  <th className="text-center text-xs font-bold tracking-wide px-2 py-3 bg-muted w-[60px]">#</th>
                  <th className="text-center text-xs font-bold tracking-wide px-3 py-3 bg-muted w-[130px]">Time</th>
                  {MODAL_DAYS.map((day) => (
                    <th key={day.index}
                      className={`text-center text-xs font-bold tracking-wide px-3 py-3 border-l ${dayHeaderClass(day.index)}`}>
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modalSlots.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No timetable entries for this level yet.
                    </td>
                  </tr>
                ) : (
                  modalSlots.map((slot, slotIndex) => (
                    <tr key={slot.key} className="border-t align-top">
                      <td className="text-center px-2 py-3 text-2xl font-bold text-muted-foreground">{slotIndex + 1}</td>
                      <td className="text-center px-3 py-3 text-xs font-semibold bg-muted/50">{slot.start} - {slot.end}</td>
                      {MODAL_DAYS.map((day) => {
                        const cellItems = getItemsForCell(day.index, slot.key);
                        return (
                          <td key={`${slot.key}-${day.index}`} className="px-2 py-2 border-l">
                            {cellItems.length === 0 ? (
                              <div className="h-16 rounded-md bg-background/60" />
                            ) : (
                              <div className="space-y-1">
                                {cellItems.map((item) => (
                                  <div key={item._id} className="rounded-md border bg-background p-2">
                                    <p className="text-xs font-semibold leading-snug">
                                      {item.subject_id?.name || "Unknown Subject"}
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
}
