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
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AttendanceReport = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/reports/admin/dashboard');
      return res.data;
    }
  });

  const attendanceRate = stats?.attendanceRate || 0;

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Attendance_Report_${new Date().getFullYear()}`;
    window.print();
    document.title = originalTitle;
  };

  const metrics = [
    { label: "Overall Attendance Rate", value: attendanceRate + "%", icon: CheckCircle, color: "bg-green-500", trend: "Live" },
    { label: "Students Registered", value: stats?.totalStudents?.toString() || "0", icon: User, color: "bg-blue-500", trend: "Live" },
    { label: "Alerts / Low Attendance", value: "0", icon: Clock, color: "bg-orange-500", trend: "Normal" },
    { label: "Staff Present", value: stats?.totalTeachers?.toString() || "0", icon: TrendingUp, color: "bg-purple-500", trend: "Live" },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading report...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
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
          .bg-green-500, .bg-blue-500, .bg-orange-500, .bg-purple-500 { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
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
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Attendance Report</h1>
                  <p className="text-slate-600 mt-1">Real-time attendance statistics from the school database</p>
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
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 border-none"
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

          {/* Detailed Stats Section (Empty for now until backend provides individual records) */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-600" />
                Attendance Distribution
              </h3>
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Activity className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic">Class-wise distribution data currently unavailable from database.</p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Attendance Trends
              </h3>
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic">Historical trend data currently unavailable from database.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceReport;
