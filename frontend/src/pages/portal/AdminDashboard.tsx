import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, GraduationCap, BookOpen, Calendar, TrendingUp, Bell, Settings, LogOut, DollarSign, ClipboardList, BarChart3, Lock, FileText, Eye, Zap } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Temporarily fetching generic users/classes counts since there is no /admin/stats endpoint yet.
      const [studentsRes, teachersRes, classesRes, announcementsRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/users/teachers'),
        api.get('/classes'),
        api.get('/announcements')
      ]);
      
      const students = studentsRes.data?.length || 0;
      const teachers = teachersRes.data?.length || 0;
      const classes = classesRes.data.data?.length || 0;
      const announcements = announcementsRes.data?.data || announcementsRes.data || [];
      
      return {
        students,
        teachers,
        classes,
        announcements
      };
    }
  });

  const stats = [
    { label: "Total Students", value: statsData?.students || 0, icon: Users, color: "bg-primary" },
    { label: "Teachers", value: statsData?.teachers || 0, icon: GraduationCap, color: "bg-secondary" },
    { label: "Active Classes", value: statsData?.classes || 0, icon: BookOpen, color: "bg-accent" },
  ];

  return (
    <div className="py-8 px-4">

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-6">Welcome back, {user?.name || 'Administrator'}! 👋</h2>
          
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
               <div className="col-span-3 flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            ) : stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="playful-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-card" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Manage Students", icon: Users, color: "bg-primary", path: "/portal/admin/students" },
              { label: "Manage Teachers", icon: GraduationCap, color: "bg-secondary", path: "/portal/admin/teachers" },
              { label: "View Reports", icon: BarChart3, color: "bg-lavender", path: "/portal/admin/reports" },
              { label: "Announcements", icon: Bell, color: "bg-coral", path: "/portal/admin/announcements" },
              { label: "Fees Management", icon: DollarSign, color: "bg-accent", path: "/portal/admin/fees" },
              { label: "Class Management", icon: BookOpen, color: "bg-pink", path: "/portal/admin/classes" },
              { label: "Feedback Review", icon: Eye, color: "bg-secondary", path: "/portal/admin/feedback" },
              { label: "Teacher Monitoring", icon: Zap, color: "bg-coral", path: "/portal/admin/teacher-monitoring" },
            ].map((action) => (
              <Link key={action.label} to={action.path}>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 w-full">
                  <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-card" />
                  </div>
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="playful-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Recent Activity</h3>
            <div className="space-y-3">
              {statsData?.announcements?.length > 0 ? (
                statsData.announcements.slice(0, 5).map((activity: any, i: number) => (
                  <div key={i} className="flex flex-col gap-1 p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span className="text-sm font-semibold">{activity.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-4">{activity.content}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-2">No recent activity.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
