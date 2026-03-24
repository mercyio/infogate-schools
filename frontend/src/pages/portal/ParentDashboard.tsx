import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Award, Bell, LogOut, FileText, TrendingUp, MessageCircle } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  
  const { data: statsData, isLoading } = useQuery({
      queryKey: ['parent-dashboard-stats'],
      queryFn: async () => {
        // Temporarily fetching generic users to simulate kids stats
        const usersRes = await api.get('/users/students');
        const children = usersRes.data || [];
        return {
          childrenCount: children.length,
          firstChild: children[0] || null
        };
      }
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-parent rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-parent-foreground" />
            </div>
            <div><h1 className="font-bold">Parent Portal</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name || "Parent"}! 👨‍👩‍👧</h2>
          
          <div className="playful-card p-6 mb-8 gradient-sunset text-accent-foreground">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-card/20 rounded-full flex items-center justify-center text-2xl">👧</div>
              <div>
                <h3 className="font-bold text-lg">Emily Thompson</h3>
                <p className="text-accent-foreground/80">Grade 4 • Section A</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Attendance", value: "94%", icon: Calendar, color: "bg-student" },
              { label: "Overall Grade", value: "A", icon: Award, color: "bg-accent" },
              { label: "Assignments", value: "8/10", icon: FileText, color: "bg-primary" },
              { label: "Rank", value: "#5", icon: TrendingUp, color: "bg-lavender" },
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
              <h3 className="font-bold text-lg mb-4">📢 School Announcements</h3>
              {["Parent-Teacher Conference on Feb 28", "Science Fair entries due Feb 1", "Spring Break: March 15-22"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-2">
                  <Bell className="w-4 h-4 text-coral" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="playful-card p-6">
              <h3 className="font-bold text-lg mb-4">💬 Teacher Feedback</h3>
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-sm italic text-muted-foreground mb-2">"Emily has shown great improvement in mathematics. Keep encouraging her reading at home!"</p>
                <p className="text-xs font-semibold">— Mrs. Johnson, Class Teacher</p>
              </div>
              <Button variant="outline" className="w-full mt-4"><MessageCircle className="w-4 h-4 mr-2" /> Message Teacher</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;
