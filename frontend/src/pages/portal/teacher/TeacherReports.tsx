import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Download, TrendingUp, Users, Award, Bell, Filter } from "lucide-react";
import { useState } from "react";

const classReports = [
  { class: "Grade 5A", students: 25, avgScore: 78, passRate: 92, topStudent: "David Wilson" },
  { class: "Grade 5B", students: 28, avgScore: 74, passRate: 88, topStudent: "Emma Stone" },
  { class: "Grade 4A", students: 32, avgScore: 82, passRate: 96, topStudent: "Alex Thompson" },
  { class: "Grade 6A", students: 30, avgScore: 71, passRate: 85, topStudent: "Lisa Brown" },
];

const studentPerformance = [
  { name: "David Wilson", class: "Grade 5A", maths: 95, english: 88, science: 92, avg: 92 },
  { name: "Sarah Johnson", class: "Grade 5A", maths: 90, english: 85, science: 88, avg: 88 },
  { name: "Emma Martinez", class: "Grade 5A", maths: 85, english: 90, science: 82, avg: 86 },
  { name: "Michael Chen", class: "Grade 5A", maths: 78, english: 82, science: 80, avg: 80 },
  { name: "Emily Davis", class: "Grade 5A", maths: 68, english: 72, science: 70, avg: 70 },
];

const TeacherReports = () => {
  const [selectedClass, setSelectedClass] = useState("All Classes");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Reports</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
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
            <h2 className="text-2xl font-bold">Class Reports</h2>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-card border rounded-xl font-medium" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option>All Classes</option>
                <option>Grade 5A</option>
                <option>Grade 5B</option>
                <option>Grade 4A</option>
              </select>
              <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
            </div>
          </div>

          {/* Class Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {classReports.map((report, i) => (
              <motion.div key={report.class} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="playful-card p-6">
                <h3 className="font-bold text-lg mb-4">{report.class}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Students</span>
                    <span className="font-semibold">{report.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Score</span>
                    <span className="font-semibold">{report.avgScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pass Rate</span>
                    <span className="font-semibold text-secondary">{report.passRate}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Top: </span>
                    <span className="text-sm font-medium">{report.topStudent}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Student Performance Table */}
          <div className="playful-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Student Performance
              </h3>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 font-semibold">Class</th>
                    <th className="text-center py-3 px-4 font-semibold">Maths</th>
                    <th className="text-center py-3 px-4 font-semibold">English</th>
                    <th className="text-center py-3 px-4 font-semibold">Science</th>
                    <th className="text-center py-3 px-4 font-semibold">Average</th>
                    <th className="text-right py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPerformance.map((student) => (
                    <tr key={student.name} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{student.class}</td>
                      <td className="py-3 px-4 text-center">{student.maths}</td>
                      <td className="py-3 px-4 text-center">{student.english}</td>
                      <td className="py-3 px-4 text-center">{student.science}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                          student.avg >= 80 ? 'bg-secondary/20 text-secondary' :
                          student.avg >= 60 ? 'bg-primary/20 text-primary' :
                          'bg-coral/20 text-coral'
                        }`}>
                          {student.avg}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm"><FileText className="w-4 h-4 mr-1" /> Report</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherReports;
