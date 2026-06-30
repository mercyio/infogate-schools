import { motion } from "framer-motion";
import { Users, Calendar, Award, Bell, LogOut, FileText, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const todayIndex = new Date().getDay();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["my-children"],
    queryFn: async () => {
      const res = await api.get("/users/parents/my-children");
      return res.data || [];
    },
  });

  // Fetch timetable and assignments for first child's class
  const firstChild = children[0];
  const classId = firstChild?.class_id?._id;

  const { data: timetables = [] } = useQuery({
    queryKey: ["parent-timetable", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await api.get(`/timetables?class_id=${classId}`);
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["parent-assignments", classId],
    enabled: !!classId,
    queryFn: async () => {
      const res = await api.get("/assignments");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const todaysClasses = timetables
    .filter((t: any) => t.day_of_week === todayIndex)
    .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Parent Portal</h1>
              <p className="text-xs text-muted-foreground">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold">Welcome, {user?.name?.split(" ")[0] || "Parent"}! 👨‍👩‍👧</h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : children.length === 0 ? (
          <div className="playful-card p-10 text-center text-muted-foreground">
            <Users className="mx-auto mb-3 opacity-40" size={36} />
            <p className="font-semibold">No children linked to your account yet.</p>
            <p className="text-sm mt-1">Ask the school admin to link your child to your account.</p>
          </div>
        ) : (
          <>
            {/* Child cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child: any) => (
                <motion.div
                  key={child._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="playful-card p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {(child.user_id?.full_name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-base">{child.user_id?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{child.class_id?.name ?? "No class assigned"}</p>
                      <p className="text-xs text-muted-foreground">{child.admission_number}</p>
                    </div>
                  </div>
                  {child.class_id && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <p className="text-muted-foreground">Level</p>
                        <p className="font-semibold">{child.class_id.level ?? "—"}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{child.status ?? "active"}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Today's Classes", value: todaysClasses.length, icon: Calendar, color: "bg-student" },
                { label: "Assignments", value: assignments.length, icon: FileText, color: "bg-coral" },
                { label: "Class", value: firstChild?.class_id?.name ?? "—", icon: BookOpen, color: "bg-lavender" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="playful-card p-5"
                >
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-card" />
                  </div>
                  <p className="text-2xl font-extrabold truncate">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's timetable */}
              <div className="playful-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">📅 Today's Classes</h3>
                  <span className="text-xs text-muted-foreground">{DAYS[todayIndex]}</span>
                </div>
                {todaysClasses.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-3">No classes scheduled for today.</p>
                ) : (
                  <div className="space-y-2">
                    {todaysClasses.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-semibold">{item.start_time} – {item.end_time}</span>
                          <span className="text-sm">{item.class_subject_id?.subject_id?.name ?? "—"}</span>
                        </div>
                        {item.room_number && (
                          <span className="text-xs text-muted-foreground">{item.room_number}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignments */}
              <div className="playful-card p-6">
                <h3 className="font-bold text-lg mb-4">📝 Assignments</h3>
                {assignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-3">No assignments yet.</p>
                ) : (
                  <div className="space-y-2">
                    {assignments.slice(0, 5).map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.class_subject_id?.subject_id?.name}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-coral/10 text-coral rounded-full font-semibold shrink-0">
                          {item.due_date ? format(new Date(item.due_date), "MMM d") : "No date"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
