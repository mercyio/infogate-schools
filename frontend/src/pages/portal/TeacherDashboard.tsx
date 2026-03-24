import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, ClipboardCheck, Bell, Settings, LogOut, FileText, Clock } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  
    const { data: statsData, isLoading } = useQuery({
      queryKey: ['teacher-dashboard-stats'],
      queryFn: async () => {
        // Fetching classes and assignments for the teacher
        const [classesRes, assignmentsRes] = await Promise.all([
           api.get('/classes'),
           api.get('/assignments')
        ]);
        const classes = classesRes.data.data || [];
        const assignments = assignmentsRes.data.data || assignmentsRes.data || [];
        
        return {
          myClasses: classes.length,
          students: classes.length * 20, // rough estimate until specific endpoint
          pendingAssignments: assignments.length,
          todaysClasses: classes.slice(0, 3) // mock schedule using their actual classes
        };
      }
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
            <div><h1 className="font-bold">Teacher Portal</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-6">Good morning, {user?.name || 'Teacher'}! 📚</h2>
          
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
                {["Mark Attendance", "Create Assignment", "View Timetable", "Grade Submissions"].map((action) => (
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
