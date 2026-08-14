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
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0a2342] via-[#0d3460] to-[#1a5276] p-8 text-white shadow-lg">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-yellow-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300/90">Academic Management</p>
                  <h1 className="text-3xl font-extrabold">Graduate Students</h1>
                </div>
              </div>
              <p className="text-sm text-white/80">Promote students to the next class or move them to alumni at the end of the academic session</p>
            </div>
          </div>
        </motion.div>

        {/* Mode Selection - More Prominent */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Operation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setGraduateMode('all');
                  setSelectedStudent(null);
                  setSelectedNextClass(null);
                }}
                className={`rounded-2xl p-6 border-2 transition-all text-left ${
                  graduateMode === 'all'
                    ? 'border-[#0a2342] bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    graduateMode === 'all' ? 'bg-[#0a2342] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Batch Promotion</p>
                    <p className="text-sm text-gray-600 mt-1">Graduate all classes at once</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setGraduateMode('student');
                  setSelectedClass(null);
                }}
                className={`rounded-2xl p-6 border-2 transition-all text-left ${
                  graduateMode === 'student'
                    ? 'border-[#0a2342] bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    graduateMode === 'student' ? 'bg-[#0a2342] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Single Student</p>
                    <p className="text-sm text-gray-600 mt-1">Move one student to a new class</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {graduateMode === 'all' ? (
            // BATCH MODE CONTENT
            <div className="space-y-6">
              {/* Promotion Plan - Main Content */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Class Progression Plan</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-[#0a2342]">{promotionPlan.length} classes</span> will be promoted in order
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {promotionPlan.length === 0 ? (
                    <p className="text-gray-400 text-center py-12 col-span-full">Loading classes...</p>
                  ) : (
                    promotionPlan.map((step: any, index: number) => (
                      <motion.div
                        key={`${step.from}-${step.to}-${index}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-2xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100/50 p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">From</p>
                            <p className="font-bold text-gray-900 text-base">{step.from}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="flex-1 text-right">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">To</p>
                            <p className="font-bold text-gray-900 text-base">{step.to}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200">
                          <p className="text-xs text-gray-600">Step {index + 1} of {promotionPlan.length}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Summary */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Ready to Graduate</h3>
                    <p className="text-blue-100 mt-2">
                      When you confirm, all {batchCount} students across all {promotionPlan.length} classes will be promoted to their next class level or alumni destination.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            // SINGLE STUDENT MODE CONTENT
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="space-y-6">
                {/* Step 1: Select Student */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="font-bold text-gray-900">Find Student</h3>
                  </div>

                  <input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name or admission number..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  />

                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
                    {studentOptions.length === 0 ? (
                      <p className="text-gray-400 text-center py-6">No students found</p>
                    ) : (
                      studentOptions.map((student: any) => (
                        <motion.button
                          key={student._id}
                          onClick={() => {
                            setSelectedStudent(student);
                            setSelectedClass(student.class_id || null);
                            setSelectedNextClass(null);
                          }}
                          whileHover={{ scale: 1.01 }}
                          className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                            selectedStudent?._id === student._id
                              ? 'border-[#0a2342] bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-gray-900">{student.user_id?.full_name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Reg: {student.admission_number} • Class: {student.class_id?.name || 'Unassigned'}
                              </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedStudent?._id === student._id ? 'border-[#0a2342] bg-[#0a2342]' : 'border-gray-300'
                            }`}>
                              {selectedStudent?._id === student._id && <CheckCircle2 className="w-5 h-5 text-white" />}
                            </div>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>

                {selectedStudent && (
                  <>
                    <div className="border-t pt-6" />

                    {/* Step 2: Select Destination */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">2</div>
                        <h3 className="font-bold text-gray-900">Choose Destination Class</h3>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {classes.map((cls: any) => (
                          <motion.button
                            key={cls._id}
                            onClick={() => setSelectedNextClass(cls)}
                            whileHover={{ scale: 1.01 }}
                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                              selectedNextClass?._id === cls._id
                                ? 'border-green-600 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-400 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-gray-900">{cls.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {cls.level} • Year: {cls.academic_year}
                                </p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedNextClass?._id === cls._id ? 'border-green-600 bg-green-600' : 'border-gray-300'
                              }`}>
                                {selectedNextClass?._id === cls._id && <CheckCircle2 className="w-5 h-5 text-white" />}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Button - Prominent */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            onClick={handleGraduate}
            disabled={graduateMode === 'student' ? (!selectedStudent || !selectedNextClass || graduateMutation.isPending) : graduateMutation.isPending}
            size="lg"
            className="w-full bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold h-14 rounded-2xl text-lg shadow-lg disabled:opacity-50"
          >
            {graduateMutation.isPending ? (
              <><Loader className="w-5 h-5 animate-spin mr-2" /> Processing...</>
            ) : graduateMode === 'all' ? (
              <><GraduationCap className="w-5 h-5 mr-2" /> Graduate All {batchCount} Students</>
            ) : (
              <><GraduationCap className="w-5 h-5 mr-2" /> Graduate {selectedStudent?.user_id?.full_name || 'Student'}</>
            )}
          </Button>
        </motion.div>

        {/* Important Notice */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Important Notice</p>
              <p className="text-amber-800 text-sm mt-2">
                This action moves students to their next class or alumni designation. It is typically performed at the end of an academic session and cannot be easily reversed. Please ensure data is backed up before proceeding.
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
