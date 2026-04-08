import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ClipboardCheck, 
  Check, 
  X, 
  Calendar as CalendarIcon, 
  Bell, 
  Save,
  Users,
  ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AttendanceManagement = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // 1. Get Teacher Profile to find assigned class
  const { data: teacherProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const res = await api.get('/users/me/teacher');
      return res.data;
    }
  });

  const selectedClass = teacherProfile?.assigned_class;

  // 2. Get Students for that class
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: async () => {
      const res = await api.get(`/users/students?class=${selectedClass}`);
      return res.data;
    },
    enabled: !!selectedClass,
  });

  // 3. Get existing attendance for today
  const { data: existingAttendance } = useQuery({
    queryKey: ['attendance', selectedClass, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const res = await api.get(`/attendance?class_id=${selectedClass}&date=${format(date, 'yyyy-MM-dd')}`);
      return res.data;
    },
    enabled: !!selectedClass,
  });

  // Sync state with existing attendance
  useEffect(() => {
    if (existingAttendance && Array.isArray(existingAttendance)) {
      const initialAttendance: Record<string, string> = {};
      existingAttendance.forEach((record: any) => {
        initialAttendance[record.student_id?._id || record.student_id] = record.status;
      });
      setAttendance(initialAttendance);
    }
  }, [existingAttendance]);

  const markAttendanceMutation = useMutation({
    mutationFn: (records: any) => api.post('/attendance', { records }),
    onSuccess: () => {
      toast.success("Attendance saved successfully!");
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: () => toast.error("Failed to save attendance")
  });

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!selectedClass) return toast.error("No class assigned to your profile");
    
    const records = students.map((s: any) => ({
      student_id: s._id,
      class_id: s.class_id?._id || selectedClass,
      date: format(date, 'yyyy-MM-dd'),
      status: attendance[s._id] || 'present'
    }));

    markAttendanceMutation.mutate(records);
  };

  const presentCount = students.filter((s: any) => (attendance[s._id] || 'present') === 'present').length;
  const absentCount = students.filter((s: any) => attendance[s._id] === 'absent').length;
  const lateCount = students.filter((s: any) => attendance[s._id] === 'late').length;

  if (isLoadingProfile) return <div className="flex items-center justify-center min-h-screen">Loading Profile...</div>;

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
            <div>
              <h1 className="font-bold">Student Attendance</h1>
              <p className="text-xs text-muted-foreground">{selectedClass || 'No Class Assigned'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button 
                onClick={handleSave} 
                disabled={markAttendanceMutation.isPending || !selectedClass}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 rounded-xl shadow-md font-bold px-6"
             >
               <Save className="w-4 h-4" />
               {markAttendanceMutation.isPending ? "Saving..." : "Save Today's Records"}
             </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="bg-card p-6 rounded-3xl border shadow-sm flex-1 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <CalendarIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{format(date, 'EEEE, MMMM do')}</h2>
                  <p className="text-muted-foreground">Daily Roll Call Performance</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto overflow-x-auto no-scrollbar">
               <StatCard label="Present" value={presentCount} color="bg-secondary" icon={<Check className="w-4 h-4" />} />
               <StatCard label="Absent" value={absentCount} color="bg-destructive" icon={<X className="w-4 h-4" />} />
               <StatCard label="Late" value={lateCount} color="bg-coral" icon={<ClipboardCheck className="w-4 h-4" />} />
            </div>
          </div>

          {/* Student list */}
          <div className="playful-card p-4 md:p-6 pb-20">
            {!selectedClass ? (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-muted-foreground">No Class Assigned</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">Please contact the admin to assign you a class before marking attendance.</p>
              </div>
            ) : isLoadingStudents ? (
              <div className="text-center py-20">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-20">No students found in {selectedClass}</div>
            ) : (
              <div className="space-y-4">
                {students.map((student: any) => (
                  <div key={student._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/40 hover:bg-muted/60 rounded-2xl border border-transparent hover:border-primary/20 transition-all gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-student/10 rounded-xl flex items-center justify-center font-bold text-student border border-student/20">
                        {student.user_id?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{student.user_id?.full_name}</p>
                        <p className="text-xs text-muted-foreground">ID: {student.admission_number || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <AttendanceButton 
                        status="present" 
                        active={(attendance[student._id] || 'present') === 'present'} 
                        onClick={() => handleStatusChange(student._id, 'present')} 
                      />
                      <AttendanceButton 
                        status="absent" 
                        active={attendance[student._id] === 'absent'} 
                        onClick={() => handleStatusChange(student._id, 'absent')} 
                      />
                      <AttendanceButton 
                        status="late" 
                        active={attendance[student._id] === 'late'} 
                        onClick={() => handleStatusChange(student._id, 'late')} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, icon }: any) => (
  <div className="playful-card min-w-[100px] p-3 flex flex-col items-center justify-center">
    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-1 text-white shadow-sm", color)}>
      {icon}
    </div>
    <p className={cn("text-xl font-black", color.replace('bg-', 'text-'))}>{value}</p>
    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
  </div>
);

const AttendanceButton = ({ status, active, onClick }: any) => {
  const getColors = () => {
    if (active) {
      if (status === 'present') return "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-105";
      if (status === 'absent') return "bg-destructive text-destructive-foreground border-destructive shadow-lg scale-105";
      if (status === 'late') return "bg-coral text-white border-coral shadow-lg scale-105";
    }
    return "bg-background text-muted-foreground border-muted-foreground/10 hover:border-muted-foreground/30";
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 sm:flex-none px-4 py-3 rounded-xl border-2 text-xs font-black uppercase transition-all duration-300 flex items-center justify-center gap-2",
        getColors()
      )}
    >
      {status === 'present' && <Check className="w-4 h-4" />}
      {status === 'absent' && <X className="w-4 h-4" />}
      {status}
    </button>
  );
};

export default AttendanceManagement;
