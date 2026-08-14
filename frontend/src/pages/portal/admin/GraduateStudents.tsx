import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  GraduationCap, BookOpen, AlertTriangle, CheckCircle2, ArrowRight, Loader
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LEVEL_ORDER: Record<string, number> = {
  creche: 0,
  nursery: 1,
  primary: 2,
  secondary: 3,
  vocational: 4,
};

const getAlumniDestination = (classItem: any) => {
  if (!classItem) return 'School Alumni';
  if (classItem.level === 'primary') return 'Primary Alumni';
  if (classItem.level === 'secondary') return 'Secondary Alumni';
  return 'School Alumni';
};

const getPromotionPlan = (classList: any[]) => {
  const orderedClasses = [...classList].sort((a: any, b: any) => {
    const levelDiff = (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99);
    if (levelDiff !== 0) return levelDiff;
    return (a.order ?? 99) - (b.order ?? 99);
  });

  return orderedClasses.map((currentClass: any, index: number) => {
    const nextClass = orderedClasses[index + 1];
    return {
      from: currentClass.name,
      to: nextClass ? nextClass.name : getAlumniDestination(currentClass),
    };
  });
};

const GraduateStudents = () => {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedNextClass, setSelectedNextClass] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [graduateMode, setGraduateMode] = useState<'all' | 'student'>('all');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [isGraduating, setIsGraduating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classes = [] } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return (res.data?.data || res.data || []).sort((a: any, b: any) => (a.order || 99) - (b.order || 99));
    },
  });

  const { data: allStudents = [] } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await api.get("/users/students");
      return res.data || [];
    },
  });

  const studentOptions = allStudents.filter((student: any) => {
    const name = student.user_id?.full_name || "";
    const reg = student.admission_number || "";
    const query = studentSearch.trim().toLowerCase();

    if (!query) return true;
    return name.toLowerCase().includes(query) || reg.toLowerCase().includes(query);
  });

  const { data: studentsCount = 0 } = useQuery({
    queryKey: ["class-students-count", selectedClass?._id],
    queryFn: async () => {
      if (!selectedClass?._id) return 0;
      const res = await api.get(`/users/students?class_id=${selectedClass._id}`);
      return (res.data || []).length;
    },
    enabled: !!selectedClass?._id && graduateMode === 'all',
  });

  const totalStudentsAcrossAllClasses = allStudents.length;

  const getNextClasses = (currentClass: any): any[] => {
    const levelOrder: Record<string, number> = {
      'creche': 0,
      'nursery': 1,
      'primary': 2,
      'secondary': 3,
      'vocational': 4,
    };

    const currentLevelNum = levelOrder[currentClass.level] || 0;

    return classes.filter((c: any) => {
      const classLevelNum = levelOrder[c.level] || 0;
      return classLevelNum > currentLevelNum ||
             (classLevelNum === currentLevelNum && (c.order || 99) > (currentClass.order || 99));
    });
  };

  const nextClasses = selectedClass ? getNextClasses(selectedClass) : [];
  const promotionPlan = getPromotionPlan(classes);

  const graduateMutation = useMutation({
    mutationFn: async () => {
      if (graduateMode === 'all') {
        const res = await api.post('/users/students/graduate/all');
        return res.data;
      }

      const res = await api.put(`/users/students/${selectedStudent._id}`, {
        class_id: selectedNextClass._id,
      });
      return { studentsCount: 1, action: 'moved', student: res.data };
    },
    onSuccess: (data) => {
      toast({
        title: "Success! ✅",
        description: graduateMode === 'all'
          ? `${data.totalAffected || 0} students were promoted in the batch.`
          : `${selectedStudent?.user_id?.full_name || 'Student'} was moved to ${selectedNextClass?.name}.`,
      });
      setConfirmDialog(false);
      setSelectedClass(null);
      setSelectedNextClass(null);
      setSelectedStudent(null);
      setStudentSearch("");
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["class-students-count"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["all-students"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to graduate students",
        variant: "destructive",
      });
    },
  });

  const handleGraduate = () => {
    if (graduateMode === 'student') {
      if (!selectedStudent) {
        toast({ title: "Error", description: "Please select a student", variant: "destructive" });
        return;
      }
      if (!selectedNextClass) {
        toast({ title: "Error", description: "Please select a destination class", variant: "destructive" });
        return;
      }
    }
    setConfirmDialog(true);
  };

  const confirmGraduation = () => {
    setIsGraduating(true);
    graduateMutation.mutate();
    setIsGraduating(false);
  };

  const selectedClassLabel = graduateMode === 'all' ? 'All classes' : selectedStudent ? selectedStudent.user_id?.full_name || 'Selected student' : 'Select a student';
  const batchCount = totalStudentsAcrossAllClasses;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] p-8 text-white shadow-lg">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-yellow-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300/90">Academic Session</p>
                  <h1 className="text-3xl font-extrabold mt-1">Graduate Students</h1>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-white/70 uppercase tracking-[0.2em]">Mode</p>
                <p className="font-bold text-lg">{graduateMode === 'all' ? 'Batch Promotion' : 'Single Student'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Graduation Mode</h2>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setGraduateMode('all')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border ${
                    graduateMode === 'all' ? 'bg-[#0a2342] text-white border-[#0a2342]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#0a2342]/30'
                  }`}
                >
                  Graduate all classes
                </button>
                <button
                  onClick={() => setGraduateMode('student')}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all border ${
                    graduateMode === 'student' ? 'bg-[#0a2342] text-white border-[#0a2342]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#0a2342]/30'
                  }`}
                >
                  Graduate single student
                </button>
              </div>
            </div>

            {graduateMode === 'student' ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Search Student</h2>
                </div>

                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by student name or reg number"
                  className="w-full mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studentOptions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No student found</p>
                  ) : (
                    studentOptions.map((student: any) => (
                      <motion.button
                        key={student._id}
                        onClick={() => {
                          setSelectedStudent(student);
                          setSelectedClass(student.class_id || null);
                          setSelectedNextClass(null);
                        }}
                        whileHover={{ scale: 1.02 }}
                        className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                          selectedStudent?._id === student._id
                            ? 'border-[#0a2342] bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900">{student.user_id?.full_name || "Unknown Student"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {student.admission_number} • {student.class_id?.name || "No class assigned"}
                            </p>
                          </div>
                          <BookOpen className={`w-5 h-5 transition-colors ${
                            selectedStudent?._id === student._id ? 'text-[#0a2342]' : 'text-gray-300'
                          }`} />
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-[#0a2342]" />
                  <h3 className="font-bold text-gray-900">Class Progression</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">All classes will advance in the following sequence:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {promotionPlan.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">Loading classes...</p>
                  ) : (
                    promotionPlan.map((step: any, index: number) => (
                      <div key={`${step.from}-${step.to}-${index}`} className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-transparent px-4 py-3 flex items-center justify-between group hover:border-[#0a2342] transition-colors">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Step {index + 1}</p>
                          <p className="font-bold text-gray-900">{step.from}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-yellow-500 mx-3" />
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Moves to</p>
                          <p className="font-bold text-gray-900">{step.to}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
            {graduateMode === 'student' ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Select Destination Class</h2>
                </div>

                {!selectedStudent ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Select a student first</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {classes.map((cls: any) => (
                      <motion.button
                        key={cls._id}
                        onClick={() => setSelectedNextClass(cls)}
                        whileHover={{ scale: 1.02 }}
                        className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                          selectedNextClass?._id === cls._id
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{cls.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Level: {cls.level} • Year: {cls.academic_year}
                            </p>
                          </div>
                          <ArrowRight className={`w-5 h-5 transition-colors ${
                            selectedNextClass?._id === cls._id ? 'text-green-600' : 'text-gray-300'
                          }`} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Batch Promotion Details</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-bold text-[#0a2342]">{promotionPlan.length}</span> classes will be promoted in this batch action:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {promotionPlan.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">Loading classes...</p>
                  ) : (
                    promotionPlan.map((step: any, index: number) => (
                      <motion.div
                        key={`${step.from}-${step.to}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 flex items-center justify-between hover:border-green-300 transition-colors"
                      >
                        <p className="font-bold text-gray-900">{step.from}</p>
                        <ArrowRight className="w-5 h-5 text-green-600 mx-3" />
                        <p className="font-bold text-gray-900 text-right">{step.to}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary Card */}
        {(graduateMode === 'student' ? selectedStudent : true) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">Current Selection</p>
                <p className="text-2xl font-bold">{selectedClassLabel}</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">
                  {graduateMode === 'student' ? (selectedNextClass ? "Moving To" : "Action") : "Batch Action"}
                </p>
                <p className="text-2xl font-bold">
                  {graduateMode === 'student' ? (selectedNextClass ? selectedNextClass.name : "Graduate") : "All classes"}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <p className="text-blue-100 text-sm">
                <span className="font-bold text-white text-lg">{graduateMode === 'student' ? 1 : batchCount}</span> student{graduateMode === 'student' ? '' : 's'} will be {graduateMode === 'student' ? (selectedNextClass ? `moved to ${selectedNextClass.name}` : "graduated") : "promoted in the batch"}
              </p>
            </div>
          </motion.div>
        )}

        {promotionPlan.length > 0 && graduateMode === 'all' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Promotion Path</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {promotionPlan.map((step: any, index: number) => (
                <div key={`${step.from}-${step.to}-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Move</p>
                  <p className="font-bold text-gray-900">{step.from} → {step.to}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            onClick={handleGraduate}
            disabled={graduateMode === 'student' ? (!selectedStudent || !selectedNextClass || graduateMutation.isPending) : graduateMutation.isPending}
            size="lg"
            className="w-full bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold h-14 rounded-2xl text-lg shadow-lg"
          >
            {graduateMutation.isPending ? (
              <><Loader className="w-5 h-5 animate-spin mr-2" /> Processing...</>
            ) : (
              <><GraduationCap className="w-5 h-5 mr-2" /> {graduateMode === 'all' ? `Graduate all ${batchCount} students` : `Graduate selected student`}</>
            )}
          </Button>
        </motion.div>

        {/* Info Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-amber-900 mb-2">⚠️ Important</p>
              <p className="text-amber-800 text-sm">
                This action will move all students from the selected class to the next class. This is typically done at the end of an academic session. Make sure you have a backup of your data before proceeding.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Confirm Graduation
            </DialogTitle>
            <DialogDescription className="pt-4">
              <div className="space-y-4">
                {graduateMode === 'all' ? (
                  <p className="text-gray-900 font-semibold">
                    Promote all students across all classes in the current session?
                  </p>
                ) : (
                  <p className="text-gray-900 font-semibold">
                    Move <span className="text-[#0a2342]">{selectedStudent?.user_id?.full_name || 'this student'}</span> from <span className="text-[#0a2342]">{selectedStudent?.class_id?.name || 'current class'}</span> to <span className="text-green-600">{selectedNextClass?.name || 'selected class'}</span>?
                  </p>
                )}
                <p className="text-gray-600 text-sm">
                  This action cannot be undone. All selected students will be moved immediately.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-6">
            <Button
              onClick={() => setConfirmDialog(false)}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmGraduation}
              disabled={isGraduating}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 text-white rounded-xl font-bold"
            >
              {isGraduating ? (
                <><Loader className="w-4 h-4 animate-spin mr-2" /> Graduating...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GraduateStudents;
