import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Calendar, BookOpen, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import TeacherSubPageLayout from "@/components/layout/TeacherSubPageLayout";

interface GroupedStudent {
  class_subject_id: string | null;
  class: { _id: string; name: string; level: string };
  subject: { _id: string; name: string; code?: string };
  students: any[];
}

interface AssignmentItem {
  _id: string;
  title: string;
  description?: string;
  due_date: string;
  total_marks: number;
  class_subject_id?: { _id?: string; class_id?: { _id?: string; name?: string }; subject_id?: { _id?: string; name?: string } } | string;
}

const AssignmentManagement = () => {
  const qc = useQueryClient();
  const now = new Date();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", due_date: "", total_marks: "100" });

  const getGroupKey = (g: GroupedStudent) =>
    g.class_subject_id ?? `${g.class._id}:${g.subject._id || g.subject.name}`;

  const { data: groupedStudents = [], isLoading } = useQuery<GroupedStudent[]>({
    queryKey: ["teacher-students-grouped"],
    queryFn: async () => { const r = await api.get("/users/teacher/students/grouped"); return r.data; },
  });

  const { data: assignments = [] } = useQuery<AssignmentItem[]>({
    queryKey: ["teacher-assignments"],
    queryFn: async () => { const r = await api.get("/assignments"); return Array.isArray(r.data) ? r.data : []; },
  });

  useEffect(() => {
    if (groupedStudents.length > 0 && !selectedGroupKey) {
      setSelectedGroupKey(getGroupKey(groupedStudents[0]));
    }
  }, [groupedStudents, selectedGroupKey]);

  const selectedGroup = useMemo(
    () => groupedStudents.find(g => getGroupKey(g) === selectedGroupKey),
    [groupedStudents, selectedGroupKey]
  );

  const groupAssignments = useMemo(() => {
    if (!selectedGroup) return [];
    return assignments.filter(a => {
      const csId = typeof a.class_subject_id === "string" ? a.class_subject_id : a.class_subject_id?._id;
      if (selectedGroup.class_subject_id && csId) return String(csId) === String(selectedGroup.class_subject_id);
      const aClassId = typeof a.class_subject_id === "string" ? undefined : a.class_subject_id?.class_id?._id;
      const aSubjId  = typeof a.class_subject_id === "string" ? undefined : a.class_subject_id?.subject_id?._id;
      return String(aClassId || "") === String(selectedGroup.class._id || "") &&
             String(aSubjId  || "") === String(selectedGroup.subject._id || "");
    });
  }, [assignments, selectedGroup]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedGroup?.class_subject_id) throw new Error("Class/subject not linked yet.");
      return api.post("/assignments", {
        title:            form.title.trim(),
        description:      form.description.trim(),
        class_subject_id: selectedGroup.class_subject_id,
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
    onError: (e: any) => toast.error(e?.response?.data?.message || e?.message || "Failed to create"),
  });

  const handleCreate = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.due_date)     return toast.error("Due date is required");
    if (Number(form.total_marks) <= 0) return toast.error("Total marks must be > 0");
    createMutation.mutate();
  };

  const canCreate = Boolean(selectedGroup?.class_subject_id);

  const createBtn = (
    <button
      onClick={() => setShowCreate(s => !s)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-extrabold transition-colors"
    >
      <Plus className="w-3.5 h-3.5" /> New
    </button>
  );

  return (
    <TeacherSubPageLayout
      title="Assignments"
      subtitle={`${assignments.length} total · ${format(now, "MMM d, yyyy")}`}
      action={createBtn}
    >
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="space-y-5">

          {/* Create form */}
          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-gray-900">Create assignment</p>
                    <button onClick={() => setShowCreate(false)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!canCreate && (
                    <div className="text-xs bg-amber-50 text-amber-700 rounded-xl px-3 py-2.5 border border-amber-100">
                      This class/subject pair isn't linked yet. Contact admin to set up ClassSubject.
                    </div>
                  )}

                  {/* Class selector (inline) */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Class & Subject</p>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {groupedStudents.map(g => {
                        const key = getGroupKey(g);
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedGroupKey(key)}
                            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                              selectedGroupKey === key
                                ? "bg-[#0a2342] text-white border-transparent"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            {g.class.name} · {g.subject.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Assignment title"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Due date</label>
                      <input
                        type="date"
                        value={form.due_date}
                        onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Total marks</label>
                      <input
                        type="number"
                        min={1}
                        value={form.total_marks}
                        onChange={e => setForm(p => ({ ...p, total_marks: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Instructions</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Assignment instructions…"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-[#0a2342] focus:ring-1 focus:ring-[#0a2342] transition resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={createMutation.isPending || !canCreate}
                    className="w-full py-3 rounded-xl bg-[#0a2342] hover:bg-[#0d3460] disabled:opacity-50 text-white text-sm font-extrabold transition-colors"
                  >
                    {createMutation.isPending ? "Creating…" : "Create Assignment"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Class selector */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Select class</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {groupedStudents.map(g => {
                const key = getGroupKey(g);
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedGroupKey(key)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedGroupKey === key
                        ? "bg-[#0a2342] text-white border-transparent shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0a2342]/30"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {g.class.name}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedGroupKey === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                    }`}>{g.subject.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignment list */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              {selectedGroup ? `${selectedGroup.class.name} · ${selectedGroup.subject.name}` : "Assignments"}
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {groupAssignments.length === 0 ? (
                <div className="px-4 py-14 text-center">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-400">No assignments yet</p>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0a2342] mx-auto hover:opacity-70 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create first assignment
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {groupAssignments.map(a => {
                    const due = a.due_date ? new Date(a.due_date) : null;
                    const overdue = due && due < now;
                    return (
                      <div key={a._id} className="flex items-start gap-3 px-4 py-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${overdue ? "bg-red-50" : "bg-amber-50"}`}>
                          <FileText className={`w-4 h-4 ${overdue ? "text-red-500" : "text-amber-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{a.title}</p>
                          {a.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{a.description}</p>}
                          {due && (
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {format(due, "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-right">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${overdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                            {overdue ? "Overdue" : due ? format(due, "MMM d") : "—"}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">{a.total_marks} marks</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="h-4" />
        </div>
      )}
    </TeacherSubPageLayout>
  );
};

export default AssignmentManagement;
