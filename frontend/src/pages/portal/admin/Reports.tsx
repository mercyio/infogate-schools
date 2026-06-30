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

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const reports = [
  {
    title: "Student Enrollment Report",
    description: "Overview of student enrollment across all programs",
    icon: Users,
    color: "bg-primary",
    lastUpdated: "Today",
    route: "/portal/admin/enrollment-report"
  },
  {
    title: "Academic Performance",
    description: "Grade analysis and performance trends",
    icon: TrendingUp,
    color: "bg-secondary",
    lastUpdated: "Yesterday",
    route: "/portal/admin/academic-report"
  },
  {
    title: "Attendance Report",
    description: "Daily and monthly attendance statistics",
    icon: Calendar,
    color: "bg-accent",
    lastUpdated: "Today",
    route: "/portal/admin/attendance-report"
  },
  {
    title: "Financial Summary",
    description: "Fee collection and revenue reports",
    icon: DollarSign,
    color: "bg-coral",
    lastUpdated: "This week",
    route: "/portal/admin/financial-report"
  },
  {
    title: "Teacher Performance",
    description: "Teaching staff evaluation and metrics",
    icon: GraduationCap,
    color: "bg-lavender",
    lastUpdated: "This month",
    route: "/portal/admin/teacher-performance-report"
  },
  {
    title: "Custom Report",
    description: "Generate custom reports with specific criteria",
    icon: FileText,
    color: "bg-admin",
    lastUpdated: "N/A",
    route: "/portal/admin/custom-report"
  },
];

const Reports = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/reports/admin/dashboard');
      return res.data;
    }
  });

  const quickStats = [
    { 
      label: "Total Students", 
      value: stats?.totalStudents?.toString() || "0", 
      change: "Live", 
      positive: true 
    },
    { 
      label: "Avg Attendance", 
      value: (stats?.attendanceRate || 0) + "%", 
      change: "Live", 
      positive: true 
    },
    { 
      label: "Total Teachers", 
      value: stats?.totalTeachers?.toString() || "0", 
      change: "Live", 
      positive: true 
    },
    { 
      label: "Total Revenue", 
      value: "₦" + (stats?.revenue || 0).toLocaleString(), 
      change: "Live", 
      positive: true 
    },
  ];

  const handleReportClick = (route: string) => navigate(route);
  const handleDownloadClick = (e: React.MouseEvent, route: string) => {
    e.stopPropagation();
    navigate(`${route}?print=1`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary/5 to-secondary/5">

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

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
                  <p className="text-3xl font-bold text-slate-900">
                    {isLoading ? "..." : stat.value}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.positive ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-700'}`}>
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
                onClick={() => handleReportClick(report.route)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-600 hover:text-slate-900"
                    title="Download PDF"
                    onClick={(e) => handleDownloadClick(e, report.route)}
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
