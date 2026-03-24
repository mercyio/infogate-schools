import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Bell, 
  LogOut, 
  ArrowLeft, 
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Download,
  FileText,
  Printer,
  LineChart,
  PieChart,
  Activity
} from "lucide-react";

const reports = [
  { 
    title: "Student Enrollment Report", 
    description: "Overview of student enrollment across all programs",
    icon: Users,
    color: "bg-primary",
    lastUpdated: "Today"
  },
  { 
    title: "Academic Performance", 
    description: "Grade analysis and performance trends",
    icon: TrendingUp,
    color: "bg-secondary",
    lastUpdated: "Yesterday"
  },
  { 
    title: "Attendance Report", 
    description: "Daily and monthly attendance statistics",
    icon: Calendar,
    color: "bg-accent",
    lastUpdated: "Today"
  },
  { 
    title: "Financial Summary", 
    description: "Fee collection and revenue reports",
    icon: DollarSign,
    color: "bg-coral",
    lastUpdated: "This week"
  },
  { 
    title: "Teacher Performance", 
    description: "Teaching staff evaluation and metrics",
    icon: GraduationCap,
    color: "bg-lavender",
    lastUpdated: "This month"
  },
  { 
    title: "Custom Report", 
    description: "Generate custom reports with specific criteria",
    icon: FileText,
    color: "bg-admin",
    lastUpdated: "N/A"
  },
];

const quickStats = [
  { label: "Total Students", value: "535", change: "+12%", positive: true },
  { label: "Avg Attendance", value: "93.5%", change: "+2.1%", positive: true },
  { label: "Total Revenue", value: "₦310.7M", change: "+18%", positive: true },
  { label: "Total Outstanding", value: "₦3.8M", change: "-8%", positive: true },
];

const Reports = () => {
  const navigate = useNavigate();

  const handleStudentEnrollmentClick = () => {
    navigate('/portal/admin/enrollment-report');
  };

  const handleAcademicPerformanceClick = () => {
    navigate('/portal/admin/academic-report');
  };

  const handleAttendanceClick = () => {
    navigate('/portal/admin/attendance-report');
  };

  const handleFinancialClick = () => {
    navigate('/portal/admin/financial-report');
  };

  const handleTeacherPerformanceClick = () => {
    navigate('/portal/admin/teacher-performance-report');
  };

  const handleCustomReportClick = () => {
    navigate('/portal/admin/custom-report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
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
          <Link to="/portal/admin" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Reports & Analytics</h2>
              <p className="text-slate-600 mt-1">View and download school reports</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${stat.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reports Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={
                  report.title === "Student Enrollment Report" 
                    ? handleStudentEnrollmentClick 
                    : report.title === "Academic Performance"
                    ? handleAcademicPerformanceClick
                    : report.title === "Attendance Report"
                    ? handleAttendanceClick
                    : report.title === "Financial Summary"
                    ? handleFinancialClick
                    : report.title === "Teacher Performance"
                    ? handleTeacherPerformanceClick
                    : report.title === "Custom Report"
                    ? handleCustomReportClick
                    : undefined
                }
                className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all ${
                  report.title === "Student Enrollment Report" || report.title === "Academic Performance" || report.title === "Attendance Report" || report.title === "Financial Summary" || report.title === "Teacher Performance" || report.title === "Custom Report"
                    ? 'cursor-pointer group' 
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center ${
                    report.title === "Student Enrollment Report" || report.title === "Academic Performance" || report.title === "Attendance Report" || report.title === "Financial Summary" || report.title === "Teacher Performance" || report.title === "Custom Report"
                      ? 'group-hover:scale-110' 
                      : ''
                  } transition-transform`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-600 hover:text-slate-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{report.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                <p className="text-xs text-slate-500">Last updated: {report.lastUpdated}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
