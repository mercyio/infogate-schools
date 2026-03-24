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
  BookOpen,
  BarChart3,
  PieChart,
  Calendar,
  Award,
  Activity,
  Target,
} from "lucide-react";
import { useState } from "react";

// Sample academic performance data by subject
const performanceBySubject = [
  { subject: "Mathematics", avgScore: 78, gradeA: 12, gradeB: 18, gradeC: 15, gradeD: 8, gradeF: 2 },
  { subject: "English Language", avgScore: 82, gradeA: 15, gradeB: 22, gradeC: 12, gradeD: 5, gradeF: 1 },
  { subject: "Science", avgScore: 75, gradeA: 10, gradeB: 16, gradeC: 18, gradeD: 10, gradeF: 3 },
  { subject: "Social Studies", avgScore: 81, gradeA: 14, gradeB: 20, gradeC: 13, gradeD: 6, gradeF: 2 },
  { subject: "Computer Science", avgScore: 79, gradeA: 13, gradeB: 19, gradeC: 14, gradeD: 7, gradeF: 2 },
  { subject: "Physical Education", avgScore: 84, gradeA: 18, gradeB: 21, gradeC: 10, gradeD: 3, gradeF: 0 },
];

// Performance by class
const performanceByClass = [
  { class: "Grade 5", avgScore: 79, passRate: 94, failRate: 6, topStudent: "Chioma Obi", topScore: 92 },
  { class: "Grade 4", avgScore: 77, passRate: 91, failRate: 9, topStudent: "Tunde Adeleke", topScore: 89 },
  { class: "Grade 3", avgScore: 76, passRate: 89, failRate: 11, topStudent: "Amara Nwankwo", topScore: 88 },
  { class: "JSS 1", avgScore: 80, passRate: 95, failRate: 5, topStudent: "Zainab Hassan", topScore: 93 },
  { class: "JSS 2", avgScore: 78, passRate: 92, failRate: 8, topStudent: "Ibrahim Yusuf", topScore: 90 },
  { class: "JSS 3", avgScore: 81, passRate: 96, failRate: 4, topStudent: "Blessing Eze", topScore: 94 },
];

// Grade distribution data
const gradeDistribution = [
  { grade: "A (90-100)", count: 82, percentage: 19.8 },
  { grade: "B (80-89)", count: 116, percentage: 28.0 },
  { grade: "C (70-79)", count: 129, percentage: 31.1 },
  { grade: "D (60-69)", count: 63, percentage: 15.2 },
  { grade: "F (Below 60)", count: 25, percentage: 6.0 },
];

// Performance trends by term
const performanceTrends = [
  { term: "Term 1", avgScore: 74, passRate: 88 },
  { term: "Term 2", avgScore: 76, passRate: 90 },
  { term: "Term 3", avgScore: 79, passRate: 93 },
];

// Key metrics
const metrics = [
  { label: "Overall Pass Rate", value: "93%", icon: Award, color: "bg-green-500", trend: "+2%" },
  { label: "Avg Score (All Subjects)", value: "79.3", icon: BookOpen, color: "bg-blue-500", trend: "+1.2" },
  { label: "Class Avg GPA", value: "3.7/4.0", icon: Target, color: "bg-purple-500", trend: "+0.1" },
  { label: "Top Performer Score", value: "94/100", icon: TrendingUp, color: "bg-orange-500", trend: "↑" },
];

const AcademicReport = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ["ACADEMIC PERFORMANCE REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["PERFORMANCE BY SUBJECT"],
      ["SUBJECT", "AVERAGE SCORE", "GRADE A", "GRADE B", "GRADE C", "GRADE D", "GRADE F"],
      ...performanceBySubject.map((item) => [item.subject, item.avgScore, item.gradeA, item.gradeB, item.gradeC, item.gradeD, item.gradeF]),
      [],
      ["PERFORMANCE BY CLASS"],
      ["CLASS", "AVG SCORE", "PASS RATE", "FAIL RATE", "TOP STUDENT", "TOP SCORE"],
      ...performanceByClass.map((item) => [item.class, item.avgScore, item.passRate + "%", item.failRate + "%", item.topStudent, item.topScore]),
      [],
      ["GRADE DISTRIBUTION"],
      ["GRADE", "COUNT", "PERCENTAGE"],
      ...gradeDistribution.map((item) => [item.grade, item.count, item.percentage + "%"]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `academic-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalStudents = 415;
  const passCount = Math.round(totalStudents * 0.93);
  const failCount = totalStudents - passCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-primary/5">
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Academic Performance Report</h1>
                  <p className="text-slate-600 mt-1">Grade analysis and performance trends across all subjects and classes</p>
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
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
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
            {/* Grade Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Grade Distribution
              </h3>
              <div className="space-y-4">
                {gradeDistribution.map((grade, index) => (
                  <div key={grade.grade}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">{grade.grade}</span>
                      <span className="text-sm font-bold text-slate-900">{grade.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          index === 0
                            ? "bg-green-500"
                            : index === 1
                            ? "bg-blue-500"
                            : index === 2
                            ? "bg-yellow-500"
                            : index === 3
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${grade.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 mt-1">{grade.percentage}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pass/Fail & Performance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Pass/Fail Summary */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Pass/Fail Summary
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-semibold mb-2">Passed</p>
                    <p className="text-4xl font-bold text-green-600">{passCount}</p>
                    <p className="text-sm text-green-600 mt-2">93% Pass Rate</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-semibold mb-2">Failed</p>
                    <p className="text-4xl font-bold text-red-600">{failCount}</p>
                    <p className="text-sm text-red-600 mt-2">7% Fail Rate</p>
                  </div>
                </div>
              </div>

              {/* Performance Trend */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Performance Trend by Term
                </h3>
                <div className="space-y-4">
                  {performanceTrends.map((trend) => (
                    <div key={trend.term}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">{trend.term}</span>
                        <span className="text-sm font-bold text-slate-900">{trend.avgScore} avg | {trend.passRate}% pass</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                          style={{ width: `${(trend.avgScore / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Subject Performance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Performance by Subject
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Subject</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Avg Score</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">A (90-100)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">B (80-89)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">C (70-79)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">D (60-69)</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">F (Below 60)</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceBySubject.map((subject) => (
                    <tr
                      key={subject.subject}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubject(subject.subject)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{subject.subject}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">{subject.avgScore}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">{subject.gradeA}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">{subject.gradeB}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 font-semibold">{subject.gradeC}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 font-semibold">{subject.gradeD}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-semibold">{subject.gradeF}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Class Performance Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                Performance by Class
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Avg Score</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Pass Rate</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Fail Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Top Student</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Top Score</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceByClass.map((classData) => (
                    <tr
                      key={classData.class}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{classData.class}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">{classData.avgScore}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">{classData.passRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 font-semibold">{classData.failRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{classData.topStudent}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">{classData.topScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-gradient-to-r from-purple-500/10 via-primary/5 to-blue-500/10 p-8 rounded-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Performance Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>93% overall pass rate indicates strong academic performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Physical Education shows highest average (84), promoting wellness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>JSS 3 class achieving 96% pass rate demonstrates maturity in learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Consistent improvement trend from Term 1 to Term 3</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Areas for Improvement</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Science average (75) needs attention; consider remedial classes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Grade 5 has lowest pass rate (94%); focus on struggling students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>6% F-grade rate requires intervention programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Mathematics needs support; 31.1% C-grade distribution</span>
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

export default AcademicReport;
