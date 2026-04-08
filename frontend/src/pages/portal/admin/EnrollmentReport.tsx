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
  Calendar,
  School,
  Activity,
} from "lucide-react";
import { useState } from "react";

// Sample enrollment data by class
const enrollmentByClass = [
  { class: "Daycare", male: 12, female: 14, total: 26 },
  { class: "KG 1", male: 15, female: 13, total: 28 },
  { class: "Nursery 1", male: 18, female: 16, total: 34 },
  { class: "Basic 1", male: 22, female: 21, total: 43 },
  { class: "Basic 5", male: 23, female: 25, total: 48 },
  { class: "JSS 1", male: 21, female: 20, total: 41 },
  { class: "JSS 3", male: 18, female: 19, total: 37 },
  { class: "SS 1", male: 20, female: 22, total: 42 },
  { class: "Vocational", male: 10, female: 12, total: 22 },
];

// Enrollment growth data by month
const enrollmentGrowth = [
  { month: "January", enrolled: 312, target: 300 },
  { month: "February", enrolled: 328, target: 330 },
  { month: "March", enrolled: 345, target: 360 },
  { month: "April", enrolled: 358, target: 390 },
  { month: "May", enrolled: 372, target: 420 },
  { month: "June", enrolled: 385, target: 450 },
];

// Enrollment by level
const enrollmentByLevel = [
  { level: "Pre-School / Nursery", total: 88, percentage: 16.4 },
  { level: "Primary (Basic)", total: 231, percentage: 43.1 },
  { level: "Secondary (JSS/SS)", total: 194, percentage: 36.3 },
  { level: "Vocational", total: 22, percentage: 4.2 },
];

// Key metrics
const metrics = [
  { label: "Total Enrollment", value: "535", icon: Users, color: "bg-blue-500", trend: "+8%" },
  { label: "Avg Class Size", value: "47.8", icon: School, color: "bg-green-500", trend: "+2%" },
  { label: "Enrollment Rate", value: "94%", icon: Activity, color: "bg-purple-500", trend: "+3%" },
  { label: "YoY Growth", value: "+12%", icon: TrendingUp, color: "bg-orange-500", trend: "↑" },
];

const EnrollmentReport = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ["STUDENT ENROLLMENT REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["CLASS NAME", "MALE", "FEMALE", "TOTAL"],
      ...enrollmentByClass.map((item) => [item.class, item.male, item.female, item.total]),
      [],
      ["ENROLLMENT BY LEVEL"],
      ["LEVEL", "TOTAL", "PERCENTAGE"],
      ...enrollmentByLevel.map((item) => [item.level, item.total, item.percentage + "%"]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `enrollment-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalEnrollment = enrollmentByClass.reduce((sum, item) => sum + item.total, 0);
  const maleCount = enrollmentByClass.reduce((sum, item) => sum + item.male, 0);
  const femaleCount = enrollmentByClass.reduce((sum, item) => sum + item.female, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-primary/5">
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Student Enrollment Report</h1>
                  <p className="text-slate-600 mt-1">Academic Year 2024 - Monitor school growth & enrollment trends</p>
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
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
            {/* Gender Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Gender Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Male</span>
                    <span className="text-sm font-bold text-slate-900">{maleCount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(maleCount / totalEnrollment) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {((maleCount / totalEnrollment) * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Female</span>
                    <span className="text-sm font-bold text-slate-900">{femaleCount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full"
                      style={{ width: `${(femaleCount / totalEnrollment) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {((femaleCount / totalEnrollment) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900">{totalEnrollment}</p>
                </div>
              </div>
            </motion.div>

            {/* Enrollment by Level */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Enrollment by Education Level
              </h3>
              <div className="space-y-4">
                {enrollmentByLevel.map((level) => (
                  <div key={level.level}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">{level.level}</span>
                      <span className="text-sm font-bold text-slate-900">{level.total} ({level.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full transition-all"
                         style={{
                          width: `${level.percentage}%`,
                          background: level.level.includes("Pre-School") ? "#3b82f6" : level.level.includes("Primary") ? "#10b981" : level.level.includes("Secondary") ? "#f59e0b" : "#8b5cf6",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Class-by-Class Enrollment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-purple-600" />
                Enrollment by Class
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Male</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Female</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Total</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentByClass.map((item, index) => (
                    <tr
                      key={item.class}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.class}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold">{item.male}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-pink-50 text-pink-700 font-semibold">{item.female}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">{item.total}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        {((item.total / totalEnrollment) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td className="px-6 py-4 text-sm text-slate-900">TOTAL</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-900">{maleCount}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-900">{femaleCount}</td>
                    <td className="px-6 py-4 text-center text-sm text-slate-900">{totalEnrollment}</td>
                    <td className="px-6 py-4 text-right text-sm text-slate-900">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Growth Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-blue-500/10 via-primary/5 to-green-500/10 p-8 rounded-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Enrollment Growth Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">Current Enrollment vs Target</p>
                <div className="flex items-end gap-2">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">535</p>
                    <p className="text-xs text-slate-600">Current</p>
                  </div>
                  <div className="text-green-600 font-bold text-lg">vs</div>
                  <div>
                    <p className="text-3xl font-bold text-slate-600">550</p>
                    <p className="text-xs text-slate-600">Target</p>
                  </div>
                </div>
                <p className="text-sm text-green-700 font-semibold mt-2">97.3% of target achieved</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Growth Metrics</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Year-over-Year Growth</span>
                    <span className="font-bold text-green-700">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Monthly Average Growth</span>
                    <span className="font-bold text-green-700">+3.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Retention Rate</span>
                    <span className="font-bold text-green-700">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnrollmentReport;
