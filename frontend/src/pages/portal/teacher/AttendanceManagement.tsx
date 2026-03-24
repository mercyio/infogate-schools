import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardCheck, Check, X, Calendar, Bell, LogOut, Filter, Save } from "lucide-react";
import { useState } from "react";

const students = [
  { id: 1, name: "Sarah Johnson", rollNo: "001", status: "present" },
  { id: 2, name: "Michael Chen", rollNo: "002", status: "present" },
  { id: 3, name: "Emily Davis", rollNo: "003", status: "absent" },
  { id: 4, name: "David Wilson", rollNo: "004", status: "present" },
  { id: 5, name: "Lisa Brown", rollNo: "005", status: "late" },
  { id: 6, name: "James Taylor", rollNo: "006", status: "present" },
  { id: 7, name: "Emma Martinez", rollNo: "007", status: "present" },
  { id: 8, name: "Alex Thompson", rollNo: "008", status: "absent" },
  { id: 9, name: "Sophie Anderson", rollNo: "009", status: "present" },
  { id: 10, name: "Ryan Garcia", rollNo: "010", status: "present" },
];

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState(
    students.reduce((acc, s) => ({ ...acc, [s.id]: s.status }), {} as Record<number, string>)
  );
  const [selectedClass, setSelectedClass] = useState("Grade 5A");

  const markAttendance = (studentId: number, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const presentCount = Object.values(attendance).filter(s => s === "present").length;
  const absentCount = Object.values(attendance).filter(s => s === "absent").length;
  const lateCount = Object.values(attendance).filter(s => s === "late").length;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Attendance</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/portal/teacher"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Mark Attendance</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-card border rounded-xl font-medium" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option>Grade 5A</option>
                <option>Grade 5B</option>
                <option>Grade 4A</option>
                <option>Grade 6A</option>
              </select>
              <Button><Save className="w-4 h-4 mr-2" /> Save</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="playful-card p-4 text-center">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 text-card" />
              </div>
              <p className="text-2xl font-bold text-secondary">{presentCount}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="playful-card p-4 text-center">
              <div className="w-12 h-12 bg-destructive rounded-xl flex items-center justify-center mx-auto mb-2">
                <X className="w-6 h-6 text-card" />
              </div>
              <p className="text-2xl font-bold text-destructive">{absentCount}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="playful-card p-4 text-center">
              <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center mx-auto mb-2">
                <ClipboardCheck className="w-6 h-6 text-card" />
              </div>
              <p className="text-2xl font-bold text-coral">{lateCount}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </div>

          {/* Student List */}
          <div className="playful-card p-6">
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-student/20 rounded-full flex items-center justify-center font-bold text-student">
                      {student.rollNo}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={attendance[student.id] === "present" ? "default" : "outline"} size="sm" className={attendance[student.id] === "present" ? "bg-secondary hover:bg-secondary/90" : ""} onClick={() => markAttendance(student.id, "present")}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button variant={attendance[student.id] === "absent" ? "default" : "outline"} size="sm" className={attendance[student.id] === "absent" ? "bg-destructive hover:bg-destructive/90" : ""} onClick={() => markAttendance(student.id, "absent")}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant={attendance[student.id] === "late" ? "default" : "outline"} size="sm" className={attendance[student.id] === "late" ? "bg-coral hover:bg-coral/90" : ""} onClick={() => markAttendance(student.id, "late")}>
                      Late
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
