import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock3, Eye, Plus, Save, Search, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface SchoolClass {
  _id: string;
  name: string;
  level: string;
}

interface ClassSubject {
  _id: string;
  class_id?: { _id: string; name: string; level: string };
  subject_id?: { _id: string; name?: string; code?: string };
}

interface TimetableItem {
  _id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
  class_subject_id?: {
    _id?: string;
    class_id?: { _id?: string; name?: string; level?: string };
    subject_id?: { _id?: string; name?: string; code?: string };
  };
}

interface DraftRow {
  id: string;
  class_subject_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MODAL_DAYS = [
  { index: 1, label: "Monday" },
  { index: 2, label: "Tuesday" },
  { index: 3, label: "Wednesday" },
  { index: 4, label: "Thursday" },
  { index: 5, label: "Friday" },
  { index: 6, label: "Saturday" },
];

const TimetableManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);
  const [modalClassName, setModalClassName] = useState<string | null>(null);

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      const raw = res.data?.data || res.data || [];
      return raw as SchoolClass[];
    },
  });

  const { data: classSubjects = [] } = useQuery({
    queryKey: ["timetable-class-subjects"],
    queryFn: async () => {
      const res = await api.get("/timetables/class-subjects");
      return (Array.isArray(res.data) ? res.data : []) as ClassSubject[];
    },
  });

  const { data: timetables = [], isLoading } = useQuery({
    queryKey: ["timetables"],
    queryFn: async () => {
      const res = await api.get("/timetables");
      return (Array.isArray(res.data) ? res.data : []) as TimetableItem[];
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: async () => {
      const entries = draftRows
        .filter((row) => row.class_subject_id && row.start_time && row.end_time)
        .map((row) => ({
          class_subject_id: row.class_subject_id,
          day_of_week: Number(row.day_of_week),
          start_time: row.start_time,
          end_time: row.end_time,
          room_number: row.room_number.trim() || undefined,
        }));

      return api.post("/timetables/bulk", { entries });
    },
    onSuccess: async (response: any) => {
      const totalSaved = response?.data?.total || 0;
      toast.success(`Saved ${totalSaved} timetable entries.`);
      setSearchTerm("");
      await queryClient.invalidateQueries({ queryKey: ["timetables"] });
      await queryClient.refetchQueries({ queryKey: ["timetables"], type: "active" });
      setDraftRows((prev) => prev.map((row) => ({ ...row, start_time: "", end_time: "", room_number: "" })));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to save timetable";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/timetables/${id}`),
    onSuccess: () => {
      toast.success("Timetable entry deleted.");
      queryClient.invalidateQueries({ queryKey: ["timetables"] });
    },
    onError: () => toast.error("Failed to delete timetable entry"),
  });

  const classSubjectOptions = useMemo(() => {
    if (!selectedClassId) {
      return [];
    }
    return classSubjects.filter((item) => item.class_id?._id === selectedClassId);
  }, [classSubjects, selectedClassId]);

  const selectedClass = useMemo(
    () => classes.find((item) => item._id === selectedClassId),
    [classes, selectedClassId]
  );

  const groupedTimetables = useMemo(() => {
    const filtered = timetables.filter((item) => {
      const className = item.class_subject_id?.class_id?.name || "";
      const subjectName = item.class_subject_id?.subject_id?.name || "";
      const text = `${className} ${subjectName}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });

    const grouped = new Map<string, TimetableItem[]>();
    filtered.forEach((item) => {
      const className = item.class_subject_id?.class_id?.name || "Unassigned Class";
      const list = grouped.get(className) || [];
      list.push(item);
      grouped.set(className, list);
    });

    return Array.from(grouped.entries()).map(([className, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        if (a.day_of_week !== b.day_of_week) {
          return a.day_of_week - b.day_of_week;
        }
        return a.start_time.localeCompare(b.start_time);
      });

      const dayMap = new Map<number, TimetableItem[]>();
      sortedItems.forEach((entry) => {
        const dayItems = dayMap.get(entry.day_of_week) || [];
        dayItems.push(entry);
        dayMap.set(entry.day_of_week, dayItems);
      });

      const dayGroups = Array.from(dayMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([dayIndex, dayItems]) => ({
          dayIndex,
          dayLabel: DAYS[dayIndex] || "Unknown Day",
          items: dayItems,
        }));

      return {
        className,
        items: sortedItems,
        totalEntries: sortedItems.length,
        activeDays: dayGroups.length,
        dayGroups,
      };
    });
  }, [timetables, searchTerm]);

  const selectedModalGroup = useMemo(
    () => groupedTimetables.find((group) => group.className === modalClassName) || null,
    [groupedTimetables, modalClassName]
  );

  const modalSlots = useMemo(() => {
    if (!selectedModalGroup) {
      return [] as Array<{ key: string; start: string; end: string }>;
    }

    const unique = new Map<string, { key: string; start: string; end: string }>();
    selectedModalGroup.items.forEach((item) => {
      const start = item.start_time;
      const end = item.end_time;
      const key = `${start}-${end}`;
      if (!unique.has(key)) {
        unique.set(key, { key, start, end });
      }
    });

    return Array.from(unique.values()).sort((a, b) => a.start.localeCompare(b.start));
  }, [selectedModalGroup]);

  const getItemsForCell = (dayIndex: number, slotKey: string) => {
    if (!selectedModalGroup) {
      return [] as TimetableItem[];
    }

    return selectedModalGroup.items.filter((item) => {
      const entryKey = `${item.start_time}-${item.end_time}`;
      return item.day_of_week === dayIndex && entryKey === slotKey;
    });
  };

  const dayHeaderClass = (dayIndex: number) => {
    switch (dayIndex) {
      case 1:
        return "bg-amber-100/70";
      case 2:
        return "bg-cyan-100/70";
      case 3:
        return "bg-indigo-100/70";
      case 4:
        return "bg-yellow-100/70";
      case 5:
        return "bg-green-100/70";
      case 6:
        return "bg-blue-100/70";
      default:
        return "bg-muted";
    }
  };

  const handleClassChange = (value: string) => {
    setSelectedClassId(value);

    setDraftRows([
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        class_subject_id: "",
        day_of_week: "1",
        start_time: "",
        end_time: "",
        room_number: "",
      },
    ]);
  };

  const updateRow = (rowId: string, patch: Partial<DraftRow>) => {
    setDraftRows((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, ...patch } : row
      )
    );
  };

  const addRow = () => {
    setDraftRows((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        class_subject_id: "",
        day_of_week: "1",
        start_time: "",
        end_time: "",
        room_number: "",
      },
    ]);
  };

  const removeRow = (rowId: string) => {
    setDraftRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleSaveClassTimetable = () => {
    if (!selectedClassId) {
      toast.error("Please choose a class first");
      return;
    }

    const rowsToSave = draftRows.filter((row) => row.class_subject_id && row.start_time && row.end_time);
    if (rowsToSave.length === 0) {
      toast.error("Select subject and time for at least one row before saving");
      return;
    }

    const invalidRow = rowsToSave.find((row) => row.start_time >= row.end_time);
    if (invalidRow) {
      toast.error("End time must be later than start time for every row");
      return;
    }

    const seen = new Map<string, number>();
    for (let i = 0; i < rowsToSave.length; i += 1) {
      const row = rowsToSave[i];
      const key = `${row.class_subject_id}|${row.day_of_week}|${row.start_time}|${row.end_time}`;
      if (seen.has(key)) {
        const firstIndex = seen.get(key)! + 1;
        const secondIndex = i + 1;
        toast.error(`Rows ${firstIndex} and ${secondIndex} are identical. Change subject/day/time in one row.`);
        return;
      }
      seen.set(key, i);
    }

    bulkCreateMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/10 border border-primary/20 shadow-xl p-8 md:p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Timetable Setup Per Class
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick one class, fill all subjects in one card, and save timetable in one click.
            </p>
          </motion.div>

          <div className="playful-card p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label>Select Class</Label>
                <Select value={selectedClassId} onValueChange={handleClassChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((item) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSaveClassTimetable}
                disabled={bulkCreateMutation.isPending || !selectedClassId || draftRows.length === 0}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {bulkCreateMutation.isPending ? "Saving..." : "Save Class Timetable"}
              </Button>
            </div>

            {selectedClassId && draftRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subjects linked to this class yet. Add subjects in class management first.
              </p>
            ) : null}

            {selectedClassId && draftRows.length > 0 ? (
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-lg">
                    {selectedClass?.name || "Selected Class"} Subject Timetable
                  </h3>
                  <Button onClick={addRow} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" /> Add Row
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full min-w-[920px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">Subject</th>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">Day</th>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">Start</th>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">End</th>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">Room</th>
                        <th className="text-left text-xs font-semibold tracking-wide px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draftRows.map((row) => (
                        <tr key={row.id} className="border-t">
                          <td className="px-4 py-3">
                            <Select
                              value={row.class_subject_id}
                              onValueChange={(value) =>
                                updateRow(row.id, { class_subject_id: value })
                              }
                            >
                              <SelectTrigger className="h-9 w-[200px]">
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {classSubjectOptions.map((option) => (
                                  <SelectItem key={option._id} value={option._id}>
                                    {option.subject_id?.name || "Unnamed Subject"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={row.day_of_week}
                              onValueChange={(value) =>
                                updateRow(row.id, { day_of_week: value })
                              }
                            >
                              <SelectTrigger className="h-9 w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DAYS.map((day, index) => (
                                  <SelectItem key={day} value={String(index)}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="time"
                              className="h-9 w-[140px]"
                              value={row.start_time}
                              onChange={(e) =>
                                updateRow(row.id, { start_time: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="time"
                              className="h-9 w-[140px]"
                              value={row.end_time}
                              onChange={(e) =>
                                updateRow(row.id, { end_time: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              placeholder="Room"
                              className="h-9 w-[180px]"
                              value={row.room_number}
                              onChange={(e) =>
                                updateRow(row.id, { room_number: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeRow(row.id)}
                              disabled={draftRows.length <= 1}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">Saved Timetables</h3>
              <p className="text-sm text-muted-foreground mt-1">{timetables.length} timetable entries</p>
            </div>
            <div className="relative flex-1 sm:flex-initial sm:min-w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search class or subject..."
                className="pl-10 h-11 rounded-lg border-primary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : groupedTimetables.length === 0 ? (
            <div className="playful-card p-10 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchTerm ? "No matching timetable entries for this search." : "No timetable entries yet."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {groupedTimetables.map((group) => (
                <div key={group.className} className="playful-card p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-base md:text-lg">{group.className}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.totalEntries} periods • {group.activeDays} active days
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setModalClassName(group.className)}
                    >
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={!!modalClassName} onOpenChange={(open) => !open && setModalClassName(null)}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>{selectedModalGroup?.className || "Class Timetable"}</DialogTitle>
                <DialogDescription>
                  Weekly timetable arranged as rows and columns.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border overflow-hidden bg-card">
                <div className="text-center py-4 border-b bg-primary/5">
                  <h4 className="text-3xl font-extrabold tracking-tight text-primary">Timetable</h4>
                </div>
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr>
                      <th className="text-center text-xs font-bold tracking-wide px-2 py-3 bg-muted w-[60px]">#</th>
                      <th className="text-center text-xs font-bold tracking-wide px-3 py-3 bg-muted w-[130px]">Time</th>
                      {MODAL_DAYS.map((day) => (
                        <th
                          key={day.index}
                          className={`text-center text-xs font-bold tracking-wide px-3 py-3 border-l ${dayHeaderClass(day.index)}`}
                        >
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modalSlots.length === 0 ? (
                      <tr className="border-t">
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No timetable entries for this class yet.
                        </td>
                      </tr>
                    ) : (
                      modalSlots.map((slot, slotIndex) => (
                        <tr key={slot.key} className="border-t align-top">
                          <td className="text-center px-2 py-3 text-2xl font-bold text-muted-foreground">{slotIndex + 1}</td>
                          <td className="text-center px-3 py-3 text-xs font-semibold bg-muted/50">
                            {slot.start} - {slot.end}
                          </td>
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
                                          {item.class_subject_id?.subject_id?.name || "Unknown Subject"}
                                        </p>
                                        {item.room_number ? (
                                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.room_number}</p>
                                        ) : null}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="mt-1 h-6 px-1.5 text-destructive text-[11px]"
                                          onClick={() => deleteMutation.mutate(item._id)}
                                          disabled={deleteMutation.isPending}
                                        >
                                          <Trash2 className="w-3 h-3 mr-1" />
                                          Remove
                                        </Button>
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
        </motion.div>
      </div>
    </div>
  );
};

export default TimetableManagement;
