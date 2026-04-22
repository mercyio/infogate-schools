import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Plus, Calendar, ChevronLeft, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  class_subject_id?: {
    _id?: string;
    class_id?: { _id?: string; name?: string };
    subject_id?: { _id?: string; name?: string };
  } | string;
}

const AssignmentManagement = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    total_marks: "100",
  });

  const queryClient = useQueryClient();

  const getGroupKey = (group: GroupedStudent) => {
    if (group.class_subject_id) {
      return group.class_subject_id;
    }
    return `${group.class._id}:${group.subject._id || group.subject.name}`;
  };

  // Fetch grouped students
  const { data: groupedStudents = [], isLoading } = useQuery({
    queryKey: ['teacher-students-grouped'],
    queryFn: async () => {
      const res = await api.get('/users/teacher/students/grouped');
      return res.data as GroupedStudent[];
    }
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: async () => {
      const res = await api.get('/assignments');
      return (Array.isArray(res.data) ? res.data : []) as AssignmentItem[];
    }
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async () => {
      const selectedGroup = groupedStudents.find((group) => getGroupKey(group) === selectedGroupKey);

      if (!selectedGroup?.class_subject_id) {
        throw new Error("This class/subject is not mapped for assignment creation yet.");
      }

      return api.post('/assignments', {
        title: form.title.trim(),
        description: form.description.trim(),
        class_subject_id: selectedGroup.class_subject_id,
        due_date: form.due_date,
        total_marks: Number(form.total_marks),
      });
    },
    onSuccess: () => {
      toast.success("Assignment created successfully.");
      setShowCreate(false);
      setForm({ title: "", description: "", due_date: "", total_marks: "100" });
      queryClient.invalidateQueries({ queryKey: ['teacher-assignments'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create assignment';
      toast.error(message);
    }
  });

  // Auto-select first class if available
  useEffect(() => {
    if (groupedStudents?.length > 0 && !selectedGroupKey) {
      setSelectedGroupKey(getGroupKey(groupedStudents[0]));
    }
  }, [groupedStudents, selectedGroupKey]);

  const selectedGroupData = useMemo(
    () => groupedStudents.find((group) => getGroupKey(group) === selectedGroupKey),
    [groupedStudents, selectedGroupKey]
  );

  const selectedGroupAssignments = useMemo(() => {
    if (!selectedGroupData) {
      return [];
    }

    return assignments.filter((assignment) => {
      const assignmentClassSubjectId =
        typeof assignment.class_subject_id === 'string'
          ? assignment.class_subject_id
          : assignment.class_subject_id?._id;

      if (selectedGroupData.class_subject_id && assignmentClassSubjectId) {
        return String(assignmentClassSubjectId) === String(selectedGroupData.class_subject_id);
      }

      const assignmentClassId =
        typeof assignment.class_subject_id === 'string'
          ? undefined
          : assignment.class_subject_id?.class_id?._id;
      const assignmentSubjectId =
        typeof assignment.class_subject_id === 'string'
          ? undefined
          : assignment.class_subject_id?.subject_id?._id;

      return (
        String(assignmentClassId || '') === String(selectedGroupData.class._id || '') &&
        String(assignmentSubjectId || '') === String(selectedGroupData.subject._id || '')
      );
    });
  }, [assignments, selectedGroupData]);

  const canCreateForGroup = Boolean(selectedGroupData?.class_subject_id);

  const handleCreateAssignment = () => {
    if (!form.title.trim()) {
      toast.error('Assignment title is required');
      return;
    }

    if (!form.due_date) {
      toast.error('Please choose a due date');
      return;
    }

    const marks = Number(form.total_marks);
    if (Number.isNaN(marks) || marks <= 0) {
      toast.error('Total marks must be greater than 0');
      return;
    }

    createAssignmentMutation.mutate();
  };

  if (isLoading) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
        <p className="text-muted-foreground">Loading your classes...</p>
      </div>
    </div>
  );

  if (!groupedStudents || groupedStudents.length === 0) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-bold text-muted-foreground">No Classes Assigned</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2">You have no classes assigned yet.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/portal/teacher" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-muted-foreground" />
            </Link>
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Assignments</h1><p className="text-xs text-muted-foreground">Manage class assignments</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
              <Plus className="w-4 h-4" /> New Assignment
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Your Assignments</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Classes Sidebar */}
            <div className="playful-card p-4">
              <h3 className="font-bold text-lg mb-4">Your Classes</h3>
              <div className="space-y-2">
                {groupedStudents.map((group) => (
                  <button
                    key={getGroupKey(group)}
                    onClick={() => {
                      setSelectedGroupKey(getGroupKey(group));
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border",
                      selectedGroupKey === getGroupKey(group)
                        ? "bg-primary text-primary-foreground border-primary shadow-lg"
                        : "bg-muted/40 hover:bg-muted/60 border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className="font-semibold text-sm truncate">{group.class.name}</div>
                    <div className="text-xs opacity-75 truncate">{group.subject.name}</div>
                    <div className="text-xs opacity-60">{group.students.length} students</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Create Form */}
              {showCreate && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="playful-card p-6 mb-8">
                  <h3 className="font-bold text-lg mb-4">Create New Assignment</h3>
                  {!canCreateForGroup && (
                    <p className="text-sm text-amber-700 bg-amber-100 rounded-lg px-3 py-2 mb-4">
                      This class/subject pair is not linked in ClassSubject yet, so assignment creation is disabled.
                    </p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        placeholder="Assignment title"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Class</label>
                      <div className="px-4 py-2 bg-muted rounded-xl font-medium">
                        {selectedGroupData?.class.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <div className="px-4 py-2 bg-muted rounded-xl font-medium">
                        {selectedGroupData?.subject.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Due Date</label>
                      <Input
                        type="date"
                        value={form.due_date}
                        onChange={(e) => setForm((prev) => ({ ...prev, due_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Marks</label>
                      <Input
                        type="number"
                        min={1}
                        value={form.total_marks}
                        onChange={(e) => setForm((prev) => ({ ...prev, total_marks: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Instructions</label>
                    <Textarea
                      placeholder="Assignment instructions..."
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreateAssignment}
                      disabled={createAssignmentMutation.isPending || !canCreateForGroup}
                    >
                      {createAssignmentMutation.isPending ? 'Creating...' : 'Create Assignment'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}

              {/* Assignments List */}
              <div className="space-y-4">
                {selectedGroupData && (
                  <div className="playful-card p-6">
                    <h3 className="font-bold text-lg mb-2">{selectedGroupData.class.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedGroupData.subject.name} • {selectedGroupData.students.length} students</p>
                    {selectedGroupAssignments.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No assignments yet for this class and subject</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setShowCreate(true)}
                        >
                          Create First Assignment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedGroupAssignments.map((assignment) => (
                          <div key={assignment._id} className="rounded-xl border bg-muted/20 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold">{assignment.title}</p>
                                {assignment.description ? (
                                  <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                                ) : null}
                              </div>
                              <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-1">
                                {assignment.total_marks} marks
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due {new Date(assignment.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignmentManagement;
