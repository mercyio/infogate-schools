import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Award, Save, Search, Filter, Bell } from "lucide-react";
import { useState } from "react";

const students = [
  { id: 1, name: "Sarah Johnson", rollNo: "001", ca1: 18, ca2: 17, exam: 55, total: 90, grade: "A" },
  { id: 2, name: "Michael Chen", rollNo: "002", ca1: 15, ca2: 16, exam: 48, total: 79, grade: "B" },
  { id: 3, name: "Emily Davis", rollNo: "003", ca1: 12, ca2: 14, exam: 42, total: 68, grade: "C" },
  { id: 4, name: "David Wilson", rollNo: "004", ca1: 19, ca2: 18, exam: 58, total: 95, grade: "A" },
  { id: 5, name: "Lisa Brown", rollNo: "005", ca1: 14, ca2: 13, exam: 38, total: 65, grade: "C" },
  { id: 6, name: "James Taylor", rollNo: "006", ca1: 16, ca2: 17, exam: 52, total: 85, grade: "A" },
  { id: 7, name: "Emma Martinez", rollNo: "007", ca1: 17, ca2: 16, exam: 50, total: 83, grade: "B" },
  { id: 8, name: "Alex Thompson", rollNo: "008", ca1: 10, ca2: 11, exam: 35, total: 56, grade: "D" },
];

const Gradebook = () => {
  const [grades, setGrades] = useState(
    students.reduce((acc, s) => ({ ...acc, [s.id]: { ca1: s.ca1, ca2: s.ca2, exam: s.exam } }), {} as Record<number, { ca1: number; ca2: number; exam: number }>)
  );
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const updateGrade = (studentId: number, field: 'ca1' | 'ca2' | 'exam', value: number) => {
    setGrades(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const calculateTotal = (studentId: number) => {
    const g = grades[studentId];
    return g.ca1 + g.ca2 + g.exam;
  };

  const getGrade = (total: number) => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "F";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teacher rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-teacher-foreground" />
            </div>
            <div><h1 className="font-bold">Gradebook</h1><p className="text-xs text-muted-foreground">Infogate Schools</p></div>
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
            <h2 className="text-2xl font-bold">Enter Grades</h2>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 bg-card border rounded-xl font-medium" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                <option>Mathematics</option>
                <option>English</option>
                <option>Science</option>
              </select>
              <select className="px-4 py-2 bg-card border rounded-xl font-medium">
                <option>Grade 5A</option>
                <option>Grade 5B</option>
                <option>Grade 4A</option>
              </select>
              <Button><Save className="w-4 h-4 mr-2" /> Save All</Button>
            </div>
          </div>

          {/* Grading Info */}
          <div className="playful-card p-4 mb-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Grading Scale:</strong> CA1 (20 marks) + CA2 (20 marks) + Exam (60 marks) = 100 marks total
              <span className="ml-4">A: 70-100 | B: 60-69 | C: 50-59 | D: 40-49 | F: Below 40</span>
            </p>
          </div>

          {/* Grades Table */}
          <div className="playful-card p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                    <th className="text-left py-3 px-4 font-semibold">Student Name</th>
                    <th className="text-center py-3 px-4 font-semibold">CA1 (20)</th>
                    <th className="text-center py-3 px-4 font-semibold">CA2 (20)</th>
                    <th className="text-center py-3 px-4 font-semibold">Exam (60)</th>
                    <th className="text-center py-3 px-4 font-semibold">Total</th>
                    <th className="text-center py-3 px-4 font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const total = calculateTotal(student.id);
                    const grade = getGrade(total);
                    return (
                      <tr key={student.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4 text-center">
                          <Input type="number" min={0} max={20} className="w-16 text-center mx-auto" value={grades[student.id]?.ca1 || 0} onChange={(e) => updateGrade(student.id, 'ca1', Math.min(20, parseInt(e.target.value) || 0))} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Input type="number" min={0} max={20} className="w-16 text-center mx-auto" value={grades[student.id]?.ca2 || 0} onChange={(e) => updateGrade(student.id, 'ca2', Math.min(20, parseInt(e.target.value) || 0))} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Input type="number" min={0} max={60} className="w-16 text-center mx-auto" value={grades[student.id]?.exam || 0} onChange={(e) => updateGrade(student.id, 'exam', Math.min(60, parseInt(e.target.value) || 0))} />
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Gradebook;
