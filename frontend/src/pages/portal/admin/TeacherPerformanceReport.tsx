import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowLeft,
  Download,
  Printer,
  Users,
  Star,
  Award,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const TeacherPerformanceReport = () => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["teacherPerformanceReport"],
    queryFn: async () => {
      const response = await api.get("/reports/admin/teacher-report");
      return response.data;
    },
  });

  const teachers = reportData?.teachers || [];

  const attendanceValues = teachers
    .map((t: any) => parseInt(t.attendance))
    .filter((val: number) => !isNaN(val));

  const avgAttendance = attendanceValues.length > 0
    ? Math.round(attendanceValues.reduce((acc: number, val: number) => acc + val, 0) / attendanceValues.length)
    : 0;

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Teacher_Performance_Report_${new Date().getFullYear()}`;
    window.print();
    document.title = originalTitle;
  };

  const getAttendanceColor = (attendance: string) => {
    if (attendance === "No Data") return "text-slate-400 bg-slate-100 border-slate-200";
    const value = parseInt(attendance);
    if (value >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (value >= 75) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-4 md:p-8">
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
          .bg-primary/10, .bg-mint/10 { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/portal/admin/reports" className="no-print">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white hover:shadow-md transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teacher Performance</h1>
              <p className="text-slate-500 font-medium">Evaluating teaching staff metrics & attendance</p>
            </div>
          </div>
          <div className="no-print flex items-center gap-3">
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 border-none px-6 transition-all transform hover:-translate-y-0.5">
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Staff</p>
                <p className="text-4xl font-black text-slate-900">{teachers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Attendance</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-slate-900">{avgAttendance}%</p>
                  <span className="text-emerald-500 text-sm font-bold">Excellent</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Teacher Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              Staff Performance Directory
            </h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-3 py-1 rounded-full">
              Real-time DB Sync
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Teacher Name</th>
                  <th className="px-8 py-5">Specialization</th>
                  <th className="px-8 py-5 text-center">Attendance Metric</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.length > 0 ? (
                  teachers.map((t: any) => (
                    <tr key={t.name} className="group hover:bg-slate-50/80 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {t.name.charAt(0)}
                          </div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{t.name}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                          {t.specialization}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-xl border font-black text-xs transition-all shadow-sm ${getAttendanceColor(t.attendance)}`}>
                            {t.attendance}
                          </span>
                          {!isNaN(parseInt(t.attendance)) && (
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${parseInt(t.attendance) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: t.attendance }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                          <Users className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">No records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-8 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Staffing Observations
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Stability</h4>
              <p>The current staff count of {teachers.length} covers primary core subjects. Attendance is consistently above {avgAttendance}%, indicating high engagement.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Strategic Alignment</h4>
              <p>Consider cross-training for {teachers.length > 0 ? teachers[0].specialization : "core subjects"} to ensure redundancy in case of unexpected leave.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherPerformanceReport;
