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
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const EnrollmentReport = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // 1. Data Fetching
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await api.get('/users/students');
      return res.data || [];
    }
  });

  const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data || [];
    }
  });

  const sfProp = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // 2. Computed Metrics
  const {
    totalEnrollment,
    maleCount,
    femaleCount,
    enrollmentByClass,
    enrollmentByLevel,
    metrics,
    enrollmentGrowth,
    unassignedCount
  } = useMemo(() => {
    const total = students.length;
    const males = students.filter((s: any) => (sfProp(s, 'user_id.gender') || s.gender || '').toLowerCase() === 'male').length;
    const females = students.filter((s: any) => (sfProp(s, 'user_id.gender') || s.gender || '').toLowerCase() === 'female').length;

    // Enrollment by Class
    const byClass = classes.map((cls: any) => {
      const classStudents = students.filter((s: any) => (s.class_id?._id || s.class_id) === cls._id);
      const cMale = classStudents.filter((s: any) => (sfProp(s, 'user_id.gender') || s.gender || '').toLowerCase() === 'male').length;
      const cFemale = classStudents.filter((s: any) => (sfProp(s, 'user_id.gender') || s.gender || '').toLowerCase() === 'female').length;
      return {
        class: cls.name,
        male: cMale,
        female: cFemale,
        total: classStudents.length,
        level: cls.level
      };
    }).sort((a: any, b: any) => b.total - a.total);

    const assignedCount = byClass.reduce((sum, c) => sum + c.total, 0);
    const unassigned = total - assignedCount;

    // Enrollment by Level (Backend enums: nursery, primary, secondary, vocational)
    const levelMap: Record<string, string> = {
      'nursery': "Pre-School / Nursery",
      'primary': "Primary (Basic)",
      'secondary': "Secondary (JSS/SS)",
      'vocational': "Vocational Training"
    };

    const byLevel = Object.keys(levelMap).map(key => {
      const levelStudents = students.filter((s: any) => {
        // Find the class for this student to check its level
        const sClass = classes.find((c: any) => c._id === (s.class_id?._id || s.class_id));
        return sClass?.level === key;
      }).length;

      return {
        level: levelMap[key],
        total: levelStudents,
        percentage: total > 0 ? Number(((levelStudents / total) * 100).toFixed(1)) : 0
      };
    });

    // Enrollment Growth (Monthly current year)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const growth = monthNames.map((name, i) => {
      const count = students.filter((s: any) => {
        const date = new Date(s.createdAt);
        return date.getMonth() === i && date.getFullYear() === currentYear;
      }).length;
      return { month: name, enrolled: count, target: Math.round(500 / 12) };
    }).slice(0, new Date().getMonth() + 1);

    // Dynamic Metrics
    const avgSize = classes.length > 0 ? (total / classes.length).toFixed(1) : "0";
    const recentEnrollment = students.filter((s: any) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(s.createdAt) > thirtyDaysAgo;
    }).length;

    // Improvement: Show % progress towards target with 1 decimal
    const targetCapacity = 500;
    const targetProgress = ((total / targetCapacity) * 100).toFixed(1);

    const dynMetrics = [
      { label: "Total Enrollment", value: total.toString(), icon: Users, color: "bg-blue-500", trend: `Total` },
      { label: "Avg Class Size", value: avgSize, icon: School, color: "bg-green-500", trend: "Students/Class" },
      { label: "New Admissions", value: recentEnrollment.toString(), icon: Activity, color: "bg-purple-500", trend: "Last 30 days" },
      { label: "Target Progress", value: `${targetProgress}%`, icon: TrendingUp, color: "bg-orange-500", trend: `of ${targetCapacity}` },
    ];

    return {
      totalEnrollment: total,
      maleCount: males,
      femaleCount: females,
      enrollmentByClass: byClass,
      enrollmentByLevel: byLevel,
      metrics: dynMetrics,
      enrollmentGrowth: growth,
      unassignedCount: unassigned
    };
  }, [students, classes]);

  if (isLoadingStudents || isLoadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Enrollment_Report_${new Date().getFullYear()}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-primary/5">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .shadow-sm, .shadow-md, .shadow-lg, .hover\\:shadow-md { 
            box-shadow: none !important; 
            transition: none !important;
          }
          body { background: white !important; }
          .container { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .bg-white { border: 1px solid #e2e8f0 !important; }
          .bg-slate-50 { background-color: #f8fafc !important; }
          .bg-blue-500, .bg-green-500, .bg-purple-500, .bg-orange-500, .bg-blue-600 { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back Button */}
          <Link to="/portal/admin/reports" className="no-print inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium">
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
                  <p className="text-slate-600 mt-1">Academic Year {new Date().getFullYear()} - Monitor school growth & enrollment trends</p>
                </div>
              </div>
              <div className="no-print flex gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
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
                      style={{ width: `${totalEnrollment > 0 ? (maleCount / totalEnrollment) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {totalEnrollment > 0 ? ((maleCount / totalEnrollment) * 100).toFixed(1) : 0}%
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
                      style={{ width: `${totalEnrollment > 0 ? (femaleCount / totalEnrollment) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">
                    {totalEnrollment > 0 ? ((femaleCount / totalEnrollment) * 100).toFixed(1) : 0}%
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
                        {totalEnrollment > 0 ? ((item.total / totalEnrollment) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                  {unassignedCount > 0 && (
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <td className="px-6 py-4 text-sm font-italic text-slate-500">Unassigned Students</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">-</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-400">-</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-slate-500">{unassignedCount}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-500">
                        {((unassignedCount / totalEnrollment) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  )}
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
              Enrollment Performance Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">School Capacity Tracking</p>
                <div className="flex items-end gap-2">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{totalEnrollment}</p>
                    <p className="text-xs text-slate-600">Current</p>
                  </div>
                  <div className="text-green-600 font-bold text-lg">/</div>
                  <div>
                    <p className="text-3xl font-bold text-slate-600">500</p>
                    <p className="text-xs text-slate-600">Target</p>
                  </div>
                </div>
                <p className="text-sm text-green-700 font-semibold mt-2">
                  {((totalEnrollment / 500) * 100).toFixed(1)}% of school capacity target reached
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Growth Metrics</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Recent Growth (30d)</span>
                    <span className="font-bold text-green-700">+{students.filter((s: any) => new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} Students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Unique Classes</span>
                    <span className="font-bold text-green-700">{classes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-700">Student-to-Class Ratio</span>
                    <span className="font-bold text-green-700">
                      {classes.length > 0 ? (totalEnrollment / classes.length).toFixed(1) : 0}:1
                    </span>
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
