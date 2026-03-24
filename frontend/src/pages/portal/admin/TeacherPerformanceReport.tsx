import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Bell,
  LogOut,
  ArrowLeft,
  Download,
  Printer,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Star,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react";
import { useState } from "react";

// Teacher performance data
const teacherPerformance = [
  { name: "Mrs. Adebayo Ife", subject: "Mathematics", rating: 4.8, students: 120, classAvg: 82, attendance: 98, yearsExperience: 8, feedback: "Excellent", trend: "+5%" },
  { name: "Mr. Chukwu Obinna", subject: "English Language", rating: 4.6, students: 115, classAvg: 85, attendance: 96, yearsExperience: 6, feedback: "Very Good", trend: "+3%" },
  { name: "Mrs. Okafor Amara", subject: "Science", rating: 4.4, students: 108, classAvg: 78, attendance: 94, yearsExperience: 5, feedback: "Good", trend: "+2%" },
  { name: "Mr. Hassan Ibrahim", subject: "Social Studies", rating: 4.7, students: 110, classAvg: 83, attendance: 97, yearsExperience: 7, feedback: "Excellent", trend: "+4%" },
  { name: "Mrs. Nwankwo Blessing", subject: "Computer Science", rating: 4.5, students: 95, classAvg: 81, attendance: 95, yearsExperience: 4, feedback: "Very Good", trend: "+6%" },
  { name: "Mr. Adeleke Tunde", subject: "Physical Education", rating: 4.9, students: 130, classAvg: 87, attendance: 99, yearsExperience: 9, feedback: "Excellent", trend: "+7%" },
];

// Performance metrics by rating
const performanceByRating = [
  { rating: "Excellent (4.5-5.0)", count: 3, percentage: 50.0 },
  { rating: "Very Good (4.0-4.4)", count: 2, percentage: 33.3 },
  { rating: "Good (3.5-3.9)", count: 1, percentage: 16.7 },
];

// Student feedback distribution
const studentFeedback = [
  { aspect: "Teaching Quality", score: 4.7, maxScore: 5 },
  { aspect: "Classroom Management", score: 4.5, maxScore: 5 },
  { aspect: "Communication Skills", score: 4.6, maxScore: 5 },
  { aspect: "Student Engagement", score: 4.4, maxScore: 5 },
  { aspect: "Feedback & Support", score: 4.8, maxScore: 5 },
];

// Professional development activities
const professionalDevelopment = [
  { teacher: "Mrs. Adebayo Ife", trainings: 4, workshops: 2, certifications: 1, hours: 48 },
  { teacher: "Mr. Chukwu Obinna", trainings: 3, workshops: 2, certifications: 1, hours: 40 },
  { teacher: "Mrs. Okafor Amara", trainings: 2, workshops: 1, certifications: 0, hours: 24 },
  { teacher: "Mr. Hassan Ibrahim", trainings: 4, workshops: 3, certifications: 2, hours: 56 },
  { teacher: "Mrs. Nwankwo Blessing", trainings: 3, workshops: 2, certifications: 1, hours: 44 },
  { teacher: "Mr. Adeleke Tunde", trainings: 5, workshops: 3, certifications: 2, hours: 64 },
];

// Attendance records
const attendanceRecords = [
  { teacher: "Mr. Adeleke Tunde", presentDays: 196, absentDays: 2, lateDays: 2, percentage: 99.0 },
  { teacher: "Mrs. Adebayo Ife", presentDays: 194, absentDays: 4, lateDays: 2, percentage: 98.0 },
  { teacher: "Mr. Hassan Ibrahim", presentDays: 192, absentDays: 6, lateDays: 2, percentage: 97.0 },
  { teacher: "Mr. Chukwu Obinna", presentDays: 190, absentDays: 8, lateDays: 2, percentage: 96.0 },
  { teacher: "Mrs. Nwankwo Blessing", presentDays: 188, absentDays: 10, lateDays: 2, percentage: 95.0 },
  { teacher: "Mrs. Okafor Amara", presentDays: 186, absentDays: 12, lateDays: 2, percentage: 94.0 },
];

// Top performers
const topPerformers = [
  { rank: 1, teacher: "Mr. Adeleke Tunde", rating: 4.9, improvement: "+7%" },
  { rank: 2, teacher: "Mrs. Adebayo Ife", rating: 4.8, improvement: "+5%" },
  { rank: 3, teacher: "Mr. Hassan Ibrahim", rating: 4.7, improvement: "+4%" },
];

// Key metrics
const metrics = [
  { label: "Average Teacher Rating", value: "4.6/5.0", icon: Star, color: "bg-yellow-500", trend: "+1.2" },
  { label: "Total Teachers", value: "6", icon: Users, color: "bg-blue-500", trend: "Stable" },
  { label: "Avg Student Class Size", value: "113", icon: BarChart3, color: "bg-purple-500", trend: "+8" },
  { label: "Avg Attendance Rate", value: "96.5%", icon: CheckCircle, color: "bg-green-500", trend: "+0.5%" },
];

const TeacherPerformanceReport = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ["TEACHER PERFORMANCE REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["TEACHER PERFORMANCE SUMMARY"],
      ["TEACHER NAME", "SUBJECT", "RATING", "STUDENTS", "CLASS AVG", "ATTENDANCE", "EXPERIENCE", "FEEDBACK"],
      ...teacherPerformance.map((item) => [
        item.name,
        item.subject,
        item.rating,
        item.students,
        item.classAvg,
        item.attendance + "%",
        item.yearsExperience + " years",
        item.feedback,
      ]),
      [],
      ["ATTENDANCE RECORDS"],
      ["TEACHER", "PRESENT", "ABSENT", "LATE", "ATTENDANCE %"],
      ...attendanceRecords.map((item) => [item.teacher, item.presentDays, item.absentDays, item.lateDays, item.percentage + "%"]),
      [],
      ["PROFESSIONAL DEVELOPMENT"],
      ["TEACHER", "TRAININGS", "WORKSHOPS", "CERTIFICATIONS", "TOTAL HOURS"],
      ...professionalDevelopment.map((item) => [item.teacher, item.trainings, item.workshops, item.certifications, item.hours]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `teacher-performance-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const avgRating = (teacherPerformance.reduce((sum, item) => sum + item.rating, 0) / teacherPerformance.length).toFixed(1);
  const avgClassScore = Math.round(teacherPerformance.reduce((sum, item) => sum + item.classAvg, 0) / teacherPerformance.length);
  const avgAttendance = (teacherPerformance.reduce((sum, item) => sum + item.attendance, 0) / teacherPerformance.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-primary/5">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Admin Portal</h1>
              <p className="text-xs text-slate-600">Infogate Schools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
            <Link to="/login"><Button variant="ghost" size="icon"><LogOut className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <Link to="/portal/admin/reports" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Link>

          {/* Report Header */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Teacher Performance Report</h1>
                  <p className="text-slate-600 mt-1">Teaching staff evaluation, student feedback, and professional development tracking</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <Award className="w-4 h-4" />
              <span>Generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${metric.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-700">{metric.trend}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 font-semibold mb-1">Avg Teacher Rating</p>
                  <p className="text-3xl font-bold text-amber-600">{avgRating}/5.0</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(parseFloat(avgRating)) ? "text-amber-400" : "text-slate-300"}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-1">Avg Class Score</p>
                  <p className="text-2xl font-bold text-blue-600">{avgClassScore}/100</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-1">Avg Attendance</p>
                  <p className="text-2xl font-bold text-green-600">{avgAttendance}%</p>
                </div>
              </div>
            </motion.div>

            {/* Performance by Rating & Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Rating Distribution */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  Performance Distribution
                </h3>
                <div className="space-y-4">
                  {performanceByRating.map((rating) => (
                    <div key={rating.rating}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">{rating.rating}</span>
                        <span className="text-sm font-bold text-slate-900">{rating.count} teachers</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-amber-500 h-3 rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 mt-1">{rating.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Feedback */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Student Feedback Scores
                </h3>
                <div className="space-y-4">
                  {studentFeedback.map((feedback) => (
                    <div key={feedback.aspect}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">{feedback.aspect}</span>
                        <span className="text-sm font-bold text-slate-900">{feedback.score}/{feedback.maxScore}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-yellow-500 h-3 rounded-full"
                          style={{ width: `${(feedback.score / feedback.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Teacher Performance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Teacher Performance Summary
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Teacher Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Subject</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Students</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Class Avg</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Attendance</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherPerformance.map((teacher) => (
                    <tr
                      key={teacher.name}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTeacher(teacher.name)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{teacher.name}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">{teacher.subject}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">{teacher.rating}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="font-semibold">{teacher.students}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">{teacher.classAvg}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">{teacher.attendance}%</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{teacher.feedback}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Attendance & Professional Development */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Attendance Records */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Teacher Attendance Records
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Teacher</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-900">Present</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-900">Absent</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-900">Late</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record.teacher} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                        <td className="px-4 py-3 font-medium text-slate-900 truncate">{record.teacher}</td>
                        <td className="px-4 py-3 text-center text-slate-700">
                          <span className="px-2 py-1 rounded bg-green-50 text-green-700 font-semibold">{record.presentDays}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700">
                          <span className="px-2 py-1 rounded bg-red-50 text-red-700 font-semibold">{record.absentDays}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-700">
                          <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 font-semibold">{record.lateDays}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">{record.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Professional Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Professional Development Activities
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {professionalDevelopment.map((dev) => (
                  <div key={dev.teacher} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-900 text-sm">{dev.teacher}</p>
                      <span className="text-sm font-bold text-slate-900">{dev.hours}h</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">Trainings: {dev.trainings}</span>
                      <span className="px-2 py-1 rounded-full bg-green-50 text-green-700">Workshops: {dev.workshops}</span>
                      <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700">Certs: {dev.certifications}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200 bg-amber-50">
              <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Top 3 Performing Teachers
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 p-6">
              {topPerformers.map((performer) => (
                <div key={performer.teacher} className="p-4 border border-slate-200 rounded-lg">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">#{performer.rank}</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-center mb-2">{performer.teacher}</p>
                  <div className="text-center mb-3">
                    <div className="flex gap-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(performer.rating) ? "text-amber-400" : "text-slate-300"}`}>★</span>
                      ))}
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">{performer.rating}/5.0</p>
                  </div>
                  <p className="text-sm text-center text-emerald-700 font-semibold">{performer.improvement} improvement</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Insights & Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-orange-500/10 p-8 rounded-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Performance Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>High average teacher rating of 4.6/5.0 demonstrates strong teaching quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Excellent teacher attendance rate of 96.5% shows commitment and reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>50% of teachers rated "Excellent"; significant achievement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Strong student feedback across all teaching quality metrics (4.4-4.8)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Areas for Development</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Encourage continued professional development; increase workshop participation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Science class average (78) needs improvement; provide targeted support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Mentor low-rated teachers with high performers for knowledge sharing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Formalize peer observation and feedback programs</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherPerformanceReport;
