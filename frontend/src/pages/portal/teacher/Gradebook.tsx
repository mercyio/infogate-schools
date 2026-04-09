import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Award, Save, Search, Filter, Bell, ChevronLeft, Users } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GroupedStudent {
  class: { _id: string; name: string; level: string };
  subject: { _id: string; name: string; code?: string };
  students: Array<{
    _id: string;
    admission_number: string;
    user: { _id: string; full_name: string };
  }>;
}

const Gradebook = () => {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { ca1: number; ca2: number; exam: number }>>({});

  // Fetch grouped students
  const { data: groupedStudents = [], isLoading } = useQuery({
    queryKey: ['teacher-students-grouped'],
    queryFn: async () => {
      const res = await api.get('/users/teacher/students/grouped');
      return res.data as GroupedStudent[];
    }
  });

  // Auto-select first class if available
  React.useEffect(() => {
    if (groupedStudents?.length > 0 && !selectedClass) {
      setSelectedClass(groupedStudents[0].class._id);
    }
  }, [groupedStudents, selectedClass]);

  // Initialize grades for selected class students
  const selectedGroupData = groupedStudents.find(g => g.class._id === selectedClass);
  React.useEffect(() => {
    if (selectedGroupData?.students) {
      const newGrades: Record<string, { ca1: number; ca2: number; exam: number }> = {};
      selectedGroupData.students.forEach(s => {
        if (!grades[s._id]) {
          newGrades[s._id] = { ca1: 0, ca2: 0, exam: 0 };
        }
      });
      if (Object.keys(newGrades).length > 0) {
        setGrades(prev => ({ ...prev, ...newGrades }));
      }
    }
  }, [selectedGroupData, selectedClass]);

  const saveGradesMutation = useMutation({
    mutationFn: async (gradesData: any) => {
      return api.post('/grades', gradesData);
    },
    onSuccess: () => {
      toast.success("Grades saved successfully!");
      queryClient.invalidateQueries({ queryKey: ['teacher-students-grouped'] });
    },
    onError: () => toast.error("Failed to save grades")
  });

  const updateGrade = (studentId: string, field: 'ca1' | 'ca2' | 'exam', value: number) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const calculateTotal = (studentId: string) => {
    const g = grades[studentId];
    if (!g) return 0;
    return g.ca1 + g.ca2 + g.exam;
  };

  const getGrade = (total: number) => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "F";
  };

  const handleSaveAll = () => {
    if (!selectedGroupData) return;
    
    const gradeRecords = selectedGroupData.students.map(student => ({
      student_id: student._id,
      class_id: selectedGroupData.class._id,
      subject_id: selectedGroupData.subject._id,
      ca1: grades[student._id]?.ca1 || 0,
      ca2: grades[student._id]?.ca2 || 0,
      exam: grades[student._id]?.exam || 0,
      total: calculateTotal(student._id),
      grade: getGrade(calculateTotal(student._id))
    }));

    saveGradesMutation.mutate({ records: gradeRecords });
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
            <div><h1 className="font-bold">Gradebook</h1><p className="text-xs text-muted-foreground">Enter and manage grades</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSaveAll}
              disabled={saveGradesMutation.isPending || !selectedGroupData?.students.length}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saveGradesMutation.isPending ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Classes Sidebar */}
            <div className="playful-card p-4">
              <h3 className="font-bold text-lg mb-4">Your Classes</h3>
              <div className="space-y-2">
                {groupedStudents.map((group) => (
                  <button
                    key={`${group.class._id}`}
                    onClick={() => setSelectedClass(group.class._id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all border",
                      selectedClass === group.class._id
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
              {/* Header Info */}
              <div className="playful-card p-4 mb-6 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Grading Scale:</strong> CA1 (20) + CA2 (20) + Exam (60) = 100 total
                  <span className="ml-4 block">A: 70-100 | B: 60-69 | C: 50-59 | D: 40-49 | F: Below 40</span>
                </p>
              </div>

              {/* Grades Table */}
              {selectedGroupData ? (
                <div className="playful-card p-6">
                  <h3 className="font-bold text-lg mb-2">{selectedGroupData.class.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{selectedGroupData.subject.name} • {selectedGroupData.students.length} students</p>
                  
                  {selectedGroupData.students.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>No students in this class</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Admission No</th>
                            <th className="text-left py-3 px-4 font-semibold">Student Name</th>
                            <th className="text-center py-3 px-4 font-semibold">CA1 (20)</th>
                            <th className="text-center py-3 px-4 font-semibold">CA2 (20)</th>
                            <th className="text-center py-3 px-4 font-semibold">Exam (60)</th>
                            <th className="text-center py-3 px-4 font-semibold">Total</th>
                            <th className="text-center py-3 px-4 font-semibold">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGroupData.students.map((student) => {
                            const total = calculateTotal(student._id);
                            const grade = getGrade(total);
                            return (
                              <tr key={student._id} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium text-sm">{student.admission_number || "N/A"}</td>
                                <td className="py-3 px-4">{student.user?.full_name || "Unknown"}</td>
                                <td className="py-3 px-4 text-center">
                                  <Input 
                                    type="number" 
                                    min={0} 
                                    max={20} 
                                    className="w-16 text-center mx-auto" 
                                    value={grades[student._id]?.ca1 || 0} 
                                    onChange={(e) => updateGrade(student._id, 'ca1', Math.min(20, parseInt(e.target.value) || 0))}
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Input 
                                    type="number" 
                                    min={0} 
                                    max={20} 
                                    className="w-16 text-center mx-auto" 
                                    value={grades[student._id]?.ca2 || 0} 
                                    onChange={(e) => updateGrade(student._id, 'ca2', Math.min(20, parseInt(e.target.value) || 0))}
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Input 
                                    type="number" 
                                    min={0} 
                                    max={60} 
                                    className="w-16 text-center mx-auto" 
                                    value={grades[student._id]?.exam || 0} 
                                    onChange={(e) => updateGrade(student._id, 'exam', Math.min(60, parseInt(e.target.value) || 0))}
                                  />
                                </td>
                                <td className="py-3 px-4 text-center font-bold">{total}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    grade === 'A' ? 'bg-secondary/20 text-secondary' :
                                    grade === 'B' ? 'bg-primary/20 text-primary' :
                                    grade === 'C' ? 'bg-coral/20 text-coral' :
                                    grade === 'D' ? 'bg-accent/20 text-accent' :
                                    'bg-destructive/20 text-destructive'
                                  }`}>
                                    {grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="playful-card p-20 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">Select a class from the sidebar to enter grades</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Gradebook;
