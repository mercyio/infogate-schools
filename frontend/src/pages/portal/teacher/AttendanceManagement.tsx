import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardCheck, Check, X, Save, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import TeacherSubPageLayout from "@/components/layout/TeacherSubPageLayout";

interface GroupedStudent {
  class: { _id: string; name: string; level: string; academic_year: string };
  subject: { _id: string; name: string; code?: string };
  students: Array<{
    _id: string;
    admission_number: string;
    user: { _id: string; full_name: string; email: string; phone: string; reg_number: string };
    class_id: string;
    gender: string;
  }>;
}

const AttendanceManagement = () => {
  const queryClient = useQueryClient();
  const [date] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const { data: groupedStudents = [], isLoading } = useQuery({
    queryKey: ["teacher-students-grouped"],
    queryFn: async () => {
      const res = await api.get("/users/teacher/students/grouped");
      return res.data as GroupedStudent[];
    },
  });

  useEffect(() => {
    if (groupedStudents.length > 0 && !selectedClassId) {
      setSelectedClassId(groupedStudents[0].class._id);
    }
  }, [groupedStudents, selectedClassId]);

  const { data: existingAttendance } = useQuery({
    queryKey: ["attendance-grouped", selectedClassId, format(date, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!selectedClassId) return [];
      const res = await api.get(`/attendance?class_id=${selectedClassId}&date=${format(date, "yyyy-MM-dd")}`);
      return res.data;
    },
    enabled: !!selectedClassId,
  });

  useEffect(() => {
    if (existingAttendance && Array.isArray(existingAttendance)) {
      const map: Record<string, string> = {};
      existingAttendance.forEach((r: any) => {
        map[r.student_id?._id || r.student_id] = r.status;
      });
      setAttendance(map);
    }
  }, [existingAttendance]);

  const markMutation = useMutation({
    mutationFn: (records: any) => api.post("/attendance", { records }),
    onSuccess: () => {
      toast.success("Attendance saved!");
      queryClient.invalidateQueries({ queryKey: ["attendance-grouped"] });
    },
    onError: () => toast.error("Failed to save attendance"),
  });

  const handleSave = () => {
    if (!selectedClassId) return toast.error("Please select a class");
    const selectedGroup = groupedStudents.find(g => g.class._id === selectedClassId);
    if (!selectedGroup) return;
    const records = selectedGroup.students.map((s: any) => ({
      student_id: s._id,
      class_id: selectedClassId,
      date: format(date, "yyyy-MM-dd"),
      status: attendance[s._id] || "present",
    }));
    markMutation.mutate(records);
  };

  const uniqueClasses = Array.from(
    new Map(groupedStudents.map(g => [g.class._id, g.class])).values()
  );

  const selectedGroup = groupedStudents.find(g => g.class._id === selectedClassId);
  const students = selectedGroup?.students ?? [];
  const presentCount = students.filter((s: any) => (attendance[s._id] || "present") === "present").length;
  const absentCount  = students.filter((s: any) => attendance[s._id] === "absent").length;
  const lateCount    = students.filter((s: any) => attendance[s._id] === "late").length;

  const saveBtn = (
    <button
      onClick={handleSave}
      disabled={markMutation.isPending || !selectedGroup || students.length === 0}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 text-xs font-extrabold transition-colors"
    >
      <Save className="w-3.5 h-3.5" />
      {markMutation.isPending ? "Saving…" : "Save"}
    </button>
  );

  return (
    <TeacherSubPageLayout
      title="Mark Attendance"
      subtitle={format(date, "EEEE, MMMM d · yyyy")}
      action={saveBtn}
    >
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading classes…</div>
      ) : uniqueClasses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 px-4 py-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400">No classes assigned yet</p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Present", value: presentCount, bg: "bg-green-50", num: "text-green-700", sub: "text-green-400" },
              { label: "Absent",  value: absentCount,  bg: "bg-red-50",   num: "text-red-700",   sub: "text-red-400"  },
              { label: "Late",    value: lateCount,    bg: "bg-amber-50", num: "text-amber-700", sub: "text-amber-400"},
            ].map(({ label, value, bg, num, sub }) => (
              <div key={label} className={`${bg} rounded-2xl py-3 text-center`}>
                <p className={`text-2xl font-extrabold ${num}`}>{value}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${sub} mt-0.5`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Class selector */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Select class</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {uniqueClasses.map(cls => (
                <button
                  key={cls._id}
                  onClick={() => setSelectedClassId(cls._id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedClassId === cls._id
                      ? "bg-[#0a2342] text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0a2342]/30"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {cls.name}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedClassId === cls._id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                  }`}>{cls.level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Student list */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Students · {students.length} total
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {students.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-sm text-gray-400">No students in this class</p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="divide-y divide-gray-50">
                    {students.map((student: any, i: number) => {
                      const status = attendance[student._id] || "present";
                      return (
                        <motion.div
                          key={student._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="flex items-center gap-3 px-4 py-3.5"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#0a2342]/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-extrabold text-[#0a2342]">
                              {(student.user?.full_name ?? "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {student.user?.full_name ?? "Student"}
                            </p>
                            <p className="text-xs text-gray-400">{student.admission_number || "—"}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <StatusBtn label="P" active={status === "present"} color="green"  onClick={() => setAttendance(p => ({ ...p, [student._id]: "present" }))} />
                            <StatusBtn label="A" active={status === "absent"}  color="red"    onClick={() => setAttendance(p => ({ ...p, [student._id]: "absent"  }))} />
                            <StatusBtn label="L" active={status === "late"}    color="amber"  onClick={() => setAttendance(p => ({ ...p, [student._id]: "late"    }))} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {students.length > 0 && (
            <button
              onClick={handleSave}
              disabled={markMutation.isPending}
              className="w-full py-4 rounded-2xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-60 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              {markMutation.isPending ? "Saving attendance…" : "Save Attendance"}
            </button>
          )}

          <div className="h-4" />
        </div>
      )}
    </TeacherSubPageLayout>
  );
};

const StatusBtn = ({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) => {
  const colors: Record<string, { active: string; idle: string }> = {
    green: { active: "bg-green-500 text-white border-green-500", idle: "bg-white text-gray-300 border-gray-200 hover:border-green-300 hover:text-green-500" },
    red:   { active: "bg-red-500 text-white border-red-500",     idle: "bg-white text-gray-300 border-gray-200 hover:border-red-300 hover:text-red-500"   },
    amber: { active: "bg-amber-500 text-white border-amber-500", idle: "bg-white text-gray-300 border-gray-200 hover:border-amber-300 hover:text-amber-500"},
  };
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl border-2 text-xs font-extrabold transition-all ${active ? colors[color].active : colors[color].idle}`}
    >
      {label}
    </button>
  );
};

export default AttendanceManagement;
