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

const GraduateStudents = () => {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedNextClass, setSelectedNextClass] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [isGraduating, setIsGraduating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all classes
  const { data: classes = [] } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const res = await api.get("/classes");
      return (res.data?.data || res.data || []).sort((a: any, b: any) => (a.order || 99) - (b.order || 99));
    },
  });

  // Fetch students in selected class
  const { data: studentsCount = 0 } = useQuery({
    queryKey: ["class-students-count", selectedClass?._id],
    queryFn: async () => {
      if (!selectedClass?._id) return 0;
      const res = await api.get(`/users/students?class_id=${selectedClass._id}`);
      return (res.data || []).length;
    },
    enabled: !!selectedClass?._id,
  });

  // Define class progression levels
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
      // Classes in next level or same level with higher order
      return classLevelNum > currentLevelNum || 
             (classLevelNum === currentLevelNum && (c.order || 99) > (currentClass.order || 99));
    });
  };

  const nextClasses = selectedClass ? getNextClasses(selectedClass) : [];

  const graduateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/users/students/graduate/class/${selectedClass._id}`, {
        nextClassId: selectedNextClass?._id || null,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success! ✅",
        description: `${data.studentsCount} students have been ${data.action} successfully.`,
      });
      setConfirmDialog(false);
      setSelectedClass(null);
      setSelectedNextClass(null);
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
      queryClient.invalidateQueries({ queryKey: ["class-students-count"] });
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
    if (!selectedClass) {
      toast({ title: "Error", description: "Please select a class", variant: "destructive" });
      return;
    }
    if (!selectedNextClass && studentsCount > 0) {
      toast({ title: "Error", description: "Please select a destination class", variant: "destructive" });
      return;
    }
    setConfirmDialog(true);
  };

  const confirmGraduation = () => {
    setIsGraduating(true);
    graduateMutation.mutate();
    setIsGraduating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a2342] to-[#1a5276] flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Graduate Students</h1>
              <p className="text-gray-600 text-sm mt-1">Promote all students from one class to the next</p>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Step 1: Select Current Class */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-gray-900">Select Current Class</h2>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {classes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No classes available</p>
              ) : (
                classes.map((cls: any) => (
                  <motion.button
                    key={cls._id}
                    onClick={() => setSelectedClass(cls)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                      selectedClass?._id === cls._id
                        ? 'border-[#0a2342] bg-blue-50 shadow-md'
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
                      <BookOpen className={`w-5 h-5 transition-colors ${
                        selectedClass?._id === cls._id ? 'text-[#0a2342]' : 'text-gray-300'
                      }`} />
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Step 2: Select Next Class */}
          <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-gray-900">Select Next Class</h2>
            </div>

            {!selectedClass ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a class first</p>
              </div>
            ) : nextClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No advancement available for this class</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {nextClasses.map((cls: any) => (
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
          </div>
        </motion.div>

        {/* Summary Card */}
        {selectedClass && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">Current Class</p>
                <p className="text-2xl font-bold">{selectedClass.name}</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">
                  {selectedNextClass ? "Moving To" : "Action"}
                </p>
                <p className="text-2xl font-bold">
                  {selectedNextClass ? selectedNextClass.name : "Graduate"}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-blue-400">
              <p className="text-blue-100 text-sm">
                <span className="font-bold text-white text-lg">{studentsCount}</span> students will be {selectedNextClass ? `moved to ${selectedNextClass.name}` : "marked as graduated"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button
            onClick={handleGraduate}
            disabled={!selectedClass || studentsCount === 0 || graduateMutation.isPending}
            size="lg"
            className="w-full bg-gradient-to-r from-[#0a2342] to-[#1a5276] hover:opacity-90 text-white font-bold h-14 rounded-2xl text-lg shadow-lg"
          >
            {graduateMutation.isPending ? (
              <><Loader className="w-5 h-5 animate-spin mr-2" /> Processing...</>
            ) : (
              <><GraduationCap className="w-5 h-5 mr-2" /> Graduate {studentsCount} Student{studentsCount !== 1 ? 's' : ''}</>
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
                <p className="text-gray-900 font-semibold">
                  Move <span className="text-[#0a2342]">{studentsCount} student{studentsCount !== 1 ? 's' : ''}</span> from <span className="text-[#0a2342]">{selectedClass?.name}</span> to <span className="text-green-600">{selectedNextClass?.name || "Alumni"}</span>?
                </p>
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
