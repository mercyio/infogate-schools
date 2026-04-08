import { motion } from "framer-motion";
import { Shield, Award, BookOpen, PieChart, BarChart3, Download, Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const AcademicReport = () => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["academicReport"],
    queryFn: async () => {
      const response = await api.get("/reports/admin/academic-report");
      return response.data;
    },
  });

  const performanceBySubject = reportData?.performanceBySubject || [];
  const gradeDistribution = reportData?.gradeDistribution || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["ACADEMIC PERFORMANCE REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["PERFORMANCE BY SUBJECT"],
      ["SUBJECT", "AVERAGE SCORE", "STUDENTS"],
      ...performanceBySubject.map((item: any) => [item.subject, item.avgScore, item.count]),
      [],
      ["GRADE DISTRIBUTION"],
      ["GRADE", "COUNT"],
      ...gradeDistribution.map((item: any) => [item.grade, item.count]),
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const avgScore = performanceBySubject.length > 0 
    ? Math.round(performanceBySubject.reduce((acc: number, s: any) => acc + s.avgScore, 0) / performanceBySubject.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/reports">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Academic Report</h1>
              <p className="text-slate-500">Live database metrics for school performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={handleDownload} className="gap-2 bg-primary hover:bg-primary/90 text-white border-none">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-xl border border-border shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Subject Coverage</p>
                <p className="text-3xl font-bold">{performanceBySubject.length} Subjects</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white rounded-xl border border-border shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-sunny/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sunny" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-3xl font-bold">{avgScore}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grade Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-white p-6 rounded-xl border border-border shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Grade Distribution
            </h3>
            <div className="space-y-4">
              {gradeDistribution.length > 0 ? (
                gradeDistribution.map((grade: any, index: number) => {
                  const total = gradeDistribution.reduce((acc: number, g: any) => acc + g.count, 0);
                  const percentage = total > 0 ? Math.round((grade.count / total) * 100) : 0;
                  const colors = ["bg-green-500", "bg-blue-500", "bg-sunny", "bg-coral", "bg-red-500"];
                  return (
                    <div key={grade.grade}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Grade {grade.grade}</span>
                        <span className="text-sm font-bold">{grade.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-8 text-slate-500 text-sm italic">No records yet</p>
              )}
            </div>
          </motion.div>

          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> Subject Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Subject</th>
                    <th className="px-6 py-4 font-semibold text-center">Avg Score</th>
                    <th className="px-6 py-4 font-semibold text-center">Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {performanceBySubject.length > 0 ? (
                    performanceBySubject.map((s: any) => (
                      <tr key={s.subject} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{s.subject}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                            {s.avgScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-500">{s.count}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">
                        No subject data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AcademicReport;
