import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowLeft,
  Download,
  Printer,
  DollarSign,
  PieChart,
  Wallet,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const FinancialReport = () => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ["financialReport"],
    queryFn: async () => {
      const response = await api.get("/reports/admin/financial-report");
      return response.data;
    },
  });

  const totalRevenue = reportData?.totalRevenue || 0;
  const outstanding = reportData?.outstanding || 0;
  const paymentStats = reportData?.paymentStats || [];

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Financial_Report_${new Date().getFullYear()}`;
    window.print();
    document.title = originalTitle;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const collectionRate = totalRevenue + outstanding > 0 
    ? Math.round((totalRevenue / (totalRevenue + outstanding)) * 100) 
    : 0;

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
          .bg-mint, .bg-sunny, .bg-coral, .bg-primary { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/portal/admin/reports" className="no-print">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financial Report</h1>
              <p className="text-slate-500">Live school fees and revenue tracking</p>
            </div>
          </div>
          <div className="no-print flex items-center gap-3">
            <Button variant="outline" onClick={handleDownloadPDF} className="gap-2 border-slate-300 text-slate-700">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 border-none">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-xl border border-border shadow-sm border-t-4 border-t-mint"
          >
            <p className="text-sm text-slate-500 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-mint">₦{totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white rounded-xl border border-border shadow-sm border-t-4 border-t-coral"
          >
            <p className="text-sm text-slate-500 mb-1">Outstanding Balance</p>
            <p className="text-3xl font-bold text-coral">₦{outstanding.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white rounded-xl border border-border shadow-sm border-t-4 border-t-primary"
          >
            <p className="text-sm text-slate-500 mb-1">Collection Rate</p>
            <p className="text-3xl font-bold text-primary">{collectionRate}%</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl border border-border shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Payment Status Breakdown
            </h3>
            <div className="space-y-6">
              {paymentStats.map((stat: any) => {
                const total = paymentStats.reduce((acc: number, s: any) => acc + s.count, 0);
                const perc = total > 0 ? Math.round((stat.count / total) * 100) : 0;
                const colors: Record<string, string> = {
                  'Paid': 'bg-mint',
                  'Pending': 'bg-sunny',
                  'Overdue': 'bg-coral'
                };
                return (
                  <div key={stat.status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{stat.status}</span>
                      <span className="text-sm font-bold">{stat.count} accounts</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${colors[stat.status] || 'bg-slate-400'}`}
                        style={{ width: `${perc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary/5 p-6 rounded-xl border border-primary/10"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Financial Insights
            </h3>
            <div className="space-y-4 text-sm text-slate-700">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-mint mt-0.5" />
                <span>Current collection rate is <strong>{collectionRate}%</strong> across all registered students.</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-coral mt-0.5" />
                <span>There are <strong>₦{outstanding.toLocaleString()}</strong> in outstanding fees that require attention.</span>
              </p>
              <p className="p-4 bg-white rounded-lg border border-primary/10 mt-4 italic text-slate-500">
                To improve collection rates, consider sending automated reminders to the "Overdue" and "Pending" account groups.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
