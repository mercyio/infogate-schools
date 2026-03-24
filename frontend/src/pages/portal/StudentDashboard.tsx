import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Calendar, Award, Bell, LogOut, FileText, Clock, Star } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  
    const { data: statsData, isLoading } = useQuery({
      queryKey: ['student-dashboard-stats'],
      queryFn: async () => {
        const [classesRes, assignmentsRes] = await Promise.all([
           api.get('/classes'),
           api.get('/assignments')
        ]);
        const classes = classesRes.data.data || [];
        const assignments = assignmentsRes.data.data || assignmentsRes.data || [];
        return {
          classesCount: classes.length,
          assignmentsCount: assignments.length,
          todaysClasses: classes.slice(0, 3), // mock schedule using their actual classes
          assignmentsList: assignments.slice(0, 3) 
        };
      }
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-student rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-student-foreground" />
            </div>
            <div><h1 className="font-bold">Student Portal</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-6">Hey there, {user?.name?.split(' ')[0] || "Student"}! 🎒 Ready to learn?</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Assignments Due", value: statsData?.assignmentsCount || 0, icon: FileText, color: "bg-coral" },
              { label: "Attendance", value: "96%", icon: Calendar, color: "bg-student" },
              { label: "Average Grade", value: "A-", icon: Award, color: "bg-accent" },
              { label: "Enrolled Classes", value: statsData?.classesCount || 0, icon: Star, color: "bg-lavender" },
            ].map((stat, i) => (
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
              <h3 className="font-bold text-lg mb-4">📅 Today's Classes</h3>
              {statsData?.todaysClasses?.length > 0 ? (
                statsData.todaysClasses.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">{item.schedule?.[0]?.time || "9:00 AM"}</span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.schedule?.[0]?.room || "TBA"}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No classes scheduled.</p>
              )}
            </div>
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-4">📝 Upcoming Assignments</h3>
              {statsData?.assignmentsList?.length > 0 ? (
                statsData.assignmentsList.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl mb-2">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs px-2 py-1 bg-coral/10 text-coral rounded-full font-semibold">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No upcoming assignments.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
