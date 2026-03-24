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
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  User,
  Activity,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

// Sample attendance data by class
const attendanceByClass = [
  { class: "Grade 5", total: 48, present: 45, absent: 2, late: 1, percentage: 93.75 },
  { class: "Grade 4", total: 43, present: 40, absent: 2, late: 1, percentage: 93.02 },
  { class: "Grade 3", total: 48, present: 44, absent: 3, late: 1, percentage: 91.67 },
  { class: "JSS 1", total: 41, present: 39, absent: 1, late: 1, percentage: 95.12 },
  { class: "JSS 2", total: 40, present: 37, absent: 2, late: 1, percentage: 92.50 },
  { class: "JSS 3", total: 37, present: 35, absent: 1, late: 1, percentage: 94.59 },
];

// Attendance trends by month
const attendanceTrends = [
  { month: "January", present: 285, absent: 35, late: 15, rate: 88.2 },
  { month: "February", present: 298, absent: 28, late: 12, rate: 90.5 },
  { month: "March", present: 312, absent: 22, late: 10, rate: 92.3 },
  { month: "April", present: 325, absent: 18, late: 8, rate: 93.8 },
  { month: "May", present: 330, absent: 15, late: 10, rate: 94.3 },
  { month: "June", present: 335, absent: 12, late: 8, rate: 95.1 },
];

// Daily attendance data (sample week)
const dailyAttendance = [
  { day: "Monday", present: 260, absent: 18, late: 8, percentage: 92.8 },
  { day: "Tuesday", present: 268, absent: 12, late: 6, percentage: 95.7 },
  { day: "Wednesday", present: 270, absent: 10, late: 6, percentage: 96.4 },
  { day: "Thursday", present: 265, absent: 14, late: 7, percentage: 94.6 },
  { day: "Friday", present: 255, absent: 20, late: 11, percentage: 91.1 },
];

// Top absent students
const topAbsentStudents = [
  { name: "Chioma Obi", class: "Grade 5", absences: 8, percentage: 83.3 },
  { name: "Tunde Adeleke", class: "Grade 4", absences: 7, percentage: 84.8 },
  { name: "Amara Nwankwo", class: "Grade 3", absences: 6, percentage: 87.5 },
  { name: "Zainab Hassan", class: "JSS 1", absences: 5, percentage: 88.0 },
  { name: "Ibrahim Yusuf", class: "JSS 2", absences: 4, percentage: 90.0 },
];

// Perfect attendance students
const perfectAttendanceStudents = [
  { name: "Blessing Eze", class: "JSS 3", absences: 0, percentage: 100 },
  { name: "Chinedu Okoro", class: "Grade 5", absences: 0, percentage: 100 },
  { name: "Fatima Muhammed", class: "JSS 1", absences: 0, percentage: 100 },
  { name: "David Okafor", class: "Grade 4", absences: 0, percentage: 100 },
  { name: "Grace Adebayo", class: "Grade 3", absences: 0, percentage: 100 },
];

// Key metrics
const metrics = [
  { label: "Overall Attendance Rate", value: "93.5%", icon: CheckCircle, color: "bg-green-500", trend: "+2.1%" },
  { label: "Students Present Today", value: "269", icon: User, color: "bg-blue-500", trend: "↑" },
  { label: "Total Absences", value: "68", icon: Clock, color: "bg-orange-500", trend: "-5" },
  { label: "Perfect Attendance", value: "27", icon: TrendingUp, color: "bg-purple-500", trend: "↑" },
];

const AttendanceReport = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ["ATTENDANCE REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["ATTENDANCE BY CLASS"],
      ["CLASS", "TOTAL STUDENTS", "PRESENT", "ABSENT", "LATE", "ATTENDANCE %"],
      ...attendanceByClass.map((item) => [item.class, item.total, item.present, item.absent, item.late, item.percentage + "%"]),
      [],
      ["MONTHLY ATTENDANCE TREND"],
      ["MONTH", "PRESENT", "ABSENT", "LATE", "ATTENDANCE RATE"],
      ...attendanceTrends.map((item) => [item.month, item.present, item.absent, item.late, item.rate + "%"]),
      [],
      ["DAILY ATTENDANCE"],
      ["DAY", "PRESENT", "ABSENT", "LATE", "PERCENTAGE"],
      ...dailyAttendance.map((item) => [item.day, item.present, item.absent, item.late, item.percentage + "%"]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `attendance-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalStudents = attendanceByClass.reduce((sum, item) => sum + item.total, 0);
  const totalPresent = attendanceByClass.reduce((sum, item) => sum + item.present, 0);
  const totalAbsent = attendanceByClass.reduce((sum, item) => sum + item.absent, 0);
  const totalLate = attendanceByClass.reduce((sum, item) => sum + item.late, 0);
  const overallAttendanceRate = ((totalPresent / totalStudents) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-primary/5">
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
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Attendance Report</h1>
                  <p className="text-slate-600 mt-1">Daily and monthly attendance statistics for monitoring student presence</p>
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
                  className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
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
            {/* Attendance Status Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-600" />
                Attendance Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Present</span>
                    <span className="text-sm font-bold text-slate-900">{totalPresent}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${(totalPresent / totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {((totalPresent / totalStudents) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Absent</span>
                    <span className="text-sm font-bold text-slate-900">{totalAbsent}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${(totalAbsent / totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {((totalAbsent / totalStudents) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Late</span>
                    <span className="text-sm font-bold text-slate-900">{totalLate}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${(totalLate / totalStudents) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {((totalLate / totalStudents) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">Overall Rate</p>
                  <p className="text-3xl font-bold text-slate-900">{overallAttendanceRate}%</p>
                </div>
              </div>
            </motion.div>

            {/* Attendance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Attendance Trend (Last 6 Months)
              </h3>
              <div className="space-y-4">
                {attendanceTrends.map((trend) => (
                  <div key={trend.month}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">{trend.month}</span>
                      <span className="text-sm font-bold text-slate-900">{trend.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all"
                        style={{ width: `${trend.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Daily Attendance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Daily Attendance (This Week)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Day</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Present</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Absent</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Late</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyAttendance.map((day) => (
                    <tr
                      key={day.day}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{day.day}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">{day.present}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-semibold">{day.absent}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 font-semibold">{day.late}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">{day.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Class Attendance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Class Attendance Details
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Total Students</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Present</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Absent</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Late</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceByClass.map((classData) => (
                    <tr
                      key={classData.class}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedClass(classData.class)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{classData.class}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">{classData.total}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">{classData.present}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-semibold">{classData.absent}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 font-semibold">{classData.late}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">{classData.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Student Attendance Lists */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Top Absent Students */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-red-50">
                <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  Top 5 Absent Students
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {topAbsentStudents.map((student, index) => (
                  <div key={student.name} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-600">{student.class}</p>
                      </div>
                      <span className="text-2xl font-bold text-red-600">{student.absences}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${student.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{student.percentage}% attendance</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Perfect Attendance Students */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-green-50">
                <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Perfect Attendance Students (5)
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {perfectAttendanceStudents.map((student) => (
                  <div key={student.name} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-600">{student.class}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-600">✓</span>
                        <p className="text-xs text-green-600 font-semibold">100%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Insights & Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-cyan-500/10 via-primary/5 to-blue-500/10 p-8 rounded-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              Attendance Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Positive Trends</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Overall attendance rate of 93.5% is excellent and shows consistent student engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>JSS 1 class maintains highest attendance at 95.12%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Steady improvement from January (88.2%) to June (95.1%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>5 students maintaining perfect attendance throughout the term</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Areas to Monitor</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Focus on 5 students with highest absence rates; consider support programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Grade 3 has lowest attendance (91.67%); investigate causes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Late arrivals need addressing; implement timely arrival incentives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Friday shows dip in attendance (91.1%); consider factors affecting end-of-week presence</span>
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

export default AttendanceReport;
