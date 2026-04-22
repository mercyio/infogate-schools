import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ClipboardCheck, Bell, Settings, LogOut, FileText, Clock } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface GroupedStudent {
  class: { _id: string; name: string; level: string; academic_year: string };
  subject: { _id?: string; name: string; code?: string };
  students: Array<{ _id: string }>;
}

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');
  
    const { data: statsData, isLoading } = useQuery({
      queryKey: ['teacher-dashboard-stats'],
      queryFn: async () => {
        // Fetching teacher-specific groups and assignments
        const [groupsRes, assignmentsRes] = await Promise.all([
             api.get('/users/teacher/students/grouped'),
             api.get('/assignments')
          ]);
          const groupedStudents = (groupsRes.data || []) as GroupedStudent[];
        const assignments = assignmentsRes.data.data || assignmentsRes.data || [];

          const uniqueClasses = new Map<string, GroupedStudent['class']>();
          groupedStudents.forEach(group => {
            uniqueClasses.set(group.class._id, group.class);
          });

          const totalStudents = groupedStudents.reduce((count, group) => count + (group.students?.length || 0), 0);
        
        return {
            myClasses: uniqueClasses.size,
            students: totalStudents,
          pendingAssignments: assignments.length,
            todaysClasses: Array.from(uniqueClasses.values()).slice(0, 3)
        };
      }
  });

  const { data: teacherProfile } = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const res = await api.get('/users/me/teacher');
      return res.data;
    }
  });

  const getFirstName = (fullName?: string) => {
    if (!fullName) return "Teacher";
    const trimmed = fullName.trim();
    if (!trimmed) return "Teacher";
    return trimmed.split(/\s+/)[0];
  };

  const firstName = getFirstName(
    teacherProfile?.user_id?.full_name ||
    user?.name ||
    user?.full_name
  );

  const { data: todayTeacherAttendance = [] } = useQuery({
    queryKey: ['teacher-attendance-today', teacherProfile?._id, today],
    queryFn: async () => {
      const res = await api.get(`/attendance/teachers?teacher_id=${teacherProfile?._id}&date=${today}`);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!teacherProfile?._id
  });

  const hasMarkedToday = todayTeacherAttendance.length > 0;

  const queryClient = useQueryClient();
  const clockInMutation = useMutation({
    mutationFn: () => api.post('/attendance/teachers', {
      records: [{
        teacher_id: teacherProfile?._id,
        date: today,
        status: 'present'
      }]
    }),
    onSuccess: () => {
      toast.success("Attendance marked for today!");
      queryClient.invalidateQueries({ queryKey: ['teacher-attendance-today'] });
    },
    onError: () => toast.error("Failed to mark attendance")
  });

  const stats = [
    { label: "My Classes", value: statsData?.myClasses || 0, icon: BookOpen, color: "bg-teacher" },
    { label: "Students", value: statsData?.students || 0, icon: Users, color: "bg-secondary" },
    { label: "Pending Assignments", value: statsData?.pendingAssignments || 0, icon: FileText, color: "bg-accent" },
    { label: "Today's Classes", value: statsData?.todaysClasses?.length || 0, icon: Clock, color: "bg-coral" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">{firstName}'s Dashboard</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">Good morning, {firstName}! 📚</h2>
              <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => clockInMutation.mutate()} 
                disabled={clockInMutation.isPending || !teacherProfile || hasMarkedToday}
                className="h-14 px-8 bg-gradient-to-r from-teacher to-teacher/80 hover:from-teacher/90 hover:to-teacher/70 rounded-2xl shadow-lg border-2 border-teacher/20 flex items-center gap-3 text-lg font-bold"
              >
                <CheckCircle2 className="w-6 h-6" />
                {clockInMutation.isPending ? "Clocking In..." : hasMarkedToday ? "Attendance Marked Today" : "Clock In for Today"}
              </Button>
            </motion.div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
               <div className="col-span-4 flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            ) : stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="playful-card p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-card" />
                </div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
              {statsData?.todaysClasses?.length > 0 ? (
                statsData.todaysClasses.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl mb-2">
                    <span className="text-sm font-semibold text-primary w-20">{item.schedule?.[0]?.day || "Mon"} {item.schedule?.[0]?.time || "9:00 AM"}</span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No classes scheduled for today.</p>
              )}
            </div>
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/portal/teacher/attendance">
                  <Button variant="outline" className="h-auto py-3 w-full">Mark Attendance</Button>
                </Link>
                <Link to="/portal/teacher/assignments">
                  <Button variant="outline" className="h-auto py-3 w-full">Create Assignment</Button>
                </Link>
                {["View Timetable", "Grade Submissions"].map((action) => (
                  <Button key={action} variant="outline" className="h-auto py-3">{action}</Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
