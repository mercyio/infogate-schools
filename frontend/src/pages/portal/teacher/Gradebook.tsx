import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Save, Users, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import TeacherSubPageLayout from "@/components/layout/TeacherSubPageLayout";

interface GroupedStudent {
  class: { _id: string; name: string; level: string };
  subject: { _id: string; name: string; code?: string };
  students: Array<{ _id: string; admission_number: string; user: { _id: string; full_name: string } }>;
}

const Gradebook = () => {
  const qc = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { ca1: number; ca2: number; exam: number }>>({});

  const { data: groupedStudents = [], isLoading } = useQuery<GroupedStudent[]>({
    queryKey: ["teacher-students-grouped"],
    queryFn: async () => { const r = await api.get("/users/teacher/students/grouped"); return r.data; },
  });

  useEffect(() => {
    if (groupedStudents.length > 0 && !selectedClass) setSelectedClass(groupedStudents[0].class._id);
  }, [groupedStudents, selectedClass]);

  const selectedGroup = groupedStudents.find(g => g.class._id === selectedClass);

  useEffect(() => {
    if (selectedGroup?.students) {
      const init: Record<string, { ca1: number; ca2: number; exam: number }> = {};
      selectedGroup.students.forEach(s => { if (!grades[s._id]) init[s._id] = { ca1: 0, ca2: 0, exam: 0 }; });
      if (Object.keys(init).length > 0) setGrades(prev => ({ ...prev, ...init }));
    }
  }, [selectedGroup]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => api.post("/grades", data),
    onSuccess: () => { toast.success("Grades saved!"); qc.invalidateQueries({ queryKey: ["teacher-students-grouped"] }); },
    onError: () => toast.error("Failed to save grades"),
  });

  const total = (id: string) => { const g = grades[id]; return g ? g.ca1 + g.ca2 + g.exam : 0; };
  const grade = (t: number) => t >= 70 ? "A" : t >= 60 ? "B" : t >= 50 ? "C" : t >= 40 ? "D" : "F";
  const gradeColor = (g: string) =>
    g === "A" ? "bg-green-100 text-green-700" : g === "B" ? "bg-blue-100 text-blue-700" :
    g === "C" ? "bg-amber-100 text-amber-700" : g === "D" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700";

  const handleSave = () => {
    if (!selectedGroup) return;
    const records = selectedGroup.students.map(s => ({
      student_id: s._id,
      class_id: selectedGroup.class._id,
      subject_id: selectedGroup.subject._id,
      ca1: grades[s._id]?.ca1 || 0,
      ca2: grades[s._id]?.ca2 || 0,
      exam: grades[s._id]?.exam || 0,
      total: total(s._id),
      grade: grade(total(s._id)),
    }));
    saveMutation.mutate({ records });
  };

  const saveBtn = (
    <button
      onClick={handleSave}
      disabled={saveMutation.isPending || !selectedGroup?.students.length}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 text-xs font-extrabold transition-colors"
    >
      <Save className="w-3.5 h-3.5" />
      {saveMutation.isPending ? "Saving…" : "Save Grades"}
    </button>
  );

  return (
    <TeacherSubPageLayout title="Gradebook" subtitle="CA1 (20) + CA2 (20) + Exam (60) = 100">
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading classes…</div>
      ) : groupedStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400">No classes assigned yet</p>
        </div>
      ) : (
        <div className="space-y-5">

          {/* Class selector */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Select class</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {groupedStudents.map(g => (
                <button
                  key={g.class._id}
                  onClick={() => setSelectedClass(g.class._id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedClass === g.class._id
                      ? "bg-[#0a2342] text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0a2342]/30"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {g.class.name}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedClass === g.class._id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                  }`}>{g.subject.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grades table */}
          {selectedGroup && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                {selectedGroup.class.name} · {selectedGroup.students.length} students
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {selectedGroup.students.length === 0 ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-gray-400">No students in this class</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                          <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">CA1 /20</th>
                          <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">CA2 /20</th>
                          <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exam /60</th>
                          <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                          <th className="text-center px-3 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedGroup.students.map(s => {
                          const t = total(s._id);
                          const g = grade(t);
                          return (
                            <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-[#0a2342]/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-extrabold text-[#0a2342]">
                                      {(s.user?.full_name ?? "?").charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-xs">{s.user?.full_name ?? "Student"}</p>
                                    <p className="text-[10px] text-gray-400">{s.admission_number || "—"}</p>
                                  </div>
                                </div>
                              </td>
                              {(["ca1", "ca2", "exam"] as const).map(field => {
                                const max = field === "exam" ? 60 : 20;
                                return (
                                  <td key={field} className="px-3 py-3 text-center">
                                    <input
                                      type="number"
                                      min={0}
                                      max={max}
                                      value={grades[s._id]?.[field] ?? 0}
                                      onChange={e => setGrades(prev => ({
                                        ...prev,
                                        [s._id]: { ...prev[s._id], [field]: Math.min(max, Math.max(0, parseInt(e.target.value) || 0)) },
                                      }))}
                                      className="w-14 text-center px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition mx-auto block"
                                    />
                                  </td>
                                );
                              })}
                              <td className="px-3 py-3 text-center font-extrabold text-gray-900">{t}</td>
                              <td className="px-3 py-3 text-center">
                                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${gradeColor(g)}`}>{g}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedGroup?.students.length ? (
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full py-4 rounded-2xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-60 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Saving grades…" : "Save All Grades"}
            </button>
          ) : null}

          <div className="h-4" />
        </div>
      )}
    </TeacherSubPageLayout>
  );
};

export default Gradebook;
