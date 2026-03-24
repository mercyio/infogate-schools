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
  DollarSign,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useState } from "react";

// Fee collection by class
const feeCollectionByClass = [
  { class: "Grade 5", expectedFees: 11952000, collected: 11206000, percentage: 93.75, outstanding: 746000 },
  { class: "Grade 4", expectedFees: 10645000, collected: 9900000, percentage: 93.00, outstanding: 745000 },
  { class: "Grade 3", expectedFees: 11856000, collected: 10854000, percentage: 91.50, outstanding: 1002000 },
  { class: "JSS 1", expectedFees: 10127000, collected: 9621000, percentage: 95.00, outstanding: 506000 },
  { class: "JSS 2", expectedFees: 9880000, collected: 9084000, percentage: 91.95, outstanding: 796000 },
  { class: "JSS 3", expectedFees: 9126000, collected: 8760000, percentage: 96.00, outstanding: 366000 },
];

// Monthly revenue trend
const monthlyRevenue = [
  { month: "January", collected: 35000000, target: 40000000, variance: -5000000 },
  { month: "February", collected: 38500000, target: 40000000, variance: -1500000 },
  { month: "March", collected: 42000000, target: 40000000, variance: 2000000 },
  { month: "April", collected: 45200000, target: 40000000, variance: 5200000 },
  { month: "May", collected: 48500000, target: 40000000, variance: 8500000 },
  { month: "June", collected: 51200000, target: 40000000, variance: 11200000 },
];

// Revenue breakdown by source
const revenueBySource = [
  { source: "Tuition Fees", amount: 180000000, percentage: 58.1 },
  { source: "Books & Materials", amount: 45000000, percentage: 14.5 },
  { source: "Uniform Fees", amount: 28000000, percentage: 9.0 },
  { source: "Development Levy", amount: 32000000, percentage: 10.3 },
  { source: "Sports Activities", amount: 15000000, percentage: 4.8 },
  { source: "Miscellaneous", amount: 10000000, percentage: 3.2 },
];

// Expense breakdown
const expenses = [
  { category: "Staff Salaries", amount: 120000000, percentage: 45.3 },
  { category: "Infrastructure", amount: 55000000, percentage: 20.8 },
  { category: "Utilities & Maintenance", amount: 35000000, percentage: 13.2 },
  { category: "Teaching Materials", amount: 28000000, percentage: 10.6 },
  { category: "Administration", amount: 17000000, percentage: 6.4 },
  { category: "Other", amount: 10000000, percentage: 3.8 },
];

// Payment status distribution
const paymentStatus = [
  { status: "Fully Paid", students: 312, percentage: 75.2 },
  { status: "Partial Payment", students: 78, percentage: 18.8 },
  { status: "Outstanding", students: 25, percentage: 6.0 },
];

// Top debtors
const topDebtors = [
  { name: "Chioma Obi", class: "Grade 5", outstanding: 150000, percentage: 68.5 },
  { name: "Tunde Adeleke", class: "Grade 4", outstanding: 145000, percentage: 72.5 },
  { name: "Amara Nwankwo", class: "Grade 3", outstanding: 132000, percentage: 71.8 },
  { name: "Ibrahim Yusuf", class: "JSS 2", outstanding: 98000, percentage: 76.2 },
  { name: "Grace Adebayo", class: "JSS 3", outstanding: 85000, percentage: 79.1 },
];

// Key metrics
const metrics = [
  { label: "Total Revenue", value: "₦310.7M", icon: DollarSign, color: "bg-green-500", trend: "+12.5%" },
  { label: "Collection Rate", value: "93.4%", icon: CheckCircle, color: "bg-blue-500", trend: "+2.3%" },
  { label: "Outstanding Balance", value: "₦3.8M", icon: AlertCircle, color: "bg-orange-500", trend: "-8%" },
  { label: "Net Profit", value: "₦37.2M", icon: TrendingUp, color: "bg-purple-500", trend: "+18%" },
];

const FinancialReport = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create CSV content
    const csvContent = [
      ["FINANCIAL SUMMARY REPORT"],
      ["Generated: " + new Date().toLocaleDateString()],
      [],
      ["FEE COLLECTION BY CLASS"],
      ["CLASS", "EXPECTED FEES", "COLLECTED", "COLLECTION %", "OUTSTANDING"],
      ...feeCollectionByClass.map((item) => [
        item.class,
        "₦" + item.expectedFees.toLocaleString(),
        "₦" + item.collected.toLocaleString(),
        item.percentage + "%",
        "₦" + item.outstanding.toLocaleString(),
      ]),
      [],
      ["MONTHLY REVENUE TREND"],
      ["MONTH", "COLLECTED", "TARGET", "VARIANCE"],
      ...monthlyRevenue.map((item) => [
        item.month,
        "₦" + item.collected.toLocaleString(),
        "₦" + item.target.toLocaleString(),
        "₦" + item.variance.toLocaleString(),
      ]),
      [],
      ["REVENUE BY SOURCE"],
      ["SOURCE", "AMOUNT", "PERCENTAGE"],
      ...revenueBySource.map((item) => [item.source, "₦" + item.amount.toLocaleString(), item.percentage + "%"]),
      [],
      ["EXPENSE BREAKDOWN"],
      ["CATEGORY", "AMOUNT", "PERCENTAGE"],
      ...expenses.map((item) => [item.category, "₦" + item.amount.toLocaleString(), item.percentage + "%"]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent));
    element.setAttribute("download", `financial-report-${new Date().getTime()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalExpected = feeCollectionByClass.reduce((sum, item) => sum + item.expectedFees, 0);
  const totalCollected = feeCollectionByClass.reduce((sum, item) => sum + item.collected, 0);
  const totalOutstanding = feeCollectionByClass.reduce((sum, item) => sum + item.outstanding, 0);
  const totalRevenue = revenueBySource.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-primary/5">
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
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Financial Summary Report</h1>
                  <p className="text-slate-600 mt-1">Fee collection, revenue analysis, and financial performance overview</p>
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
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <DollarSign className="w-4 h-4" />
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
            {/* Financial Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                Financial Overview
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700 font-semibold mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700 font-semibold mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₦{(totalExpenses / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-1">Net Profit</p>
                  <p className="text-2xl font-bold text-blue-600">₦{(netProfit / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </motion.div>

            {/* Collection Status & Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Collection Status */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Collection Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Collected</span>
                      <span className="text-sm font-bold text-slate-900">₦{(totalCollected / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${(totalCollected / totalExpected) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 mt-1">
                      {((totalCollected / totalExpected) * 100).toFixed(1)}% collection rate
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">Outstanding</span>
                      <span className="text-sm font-bold text-slate-900">₦{(totalOutstanding / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4">
                      <div
                        className="bg-red-500 h-4 rounded-full"
                        style={{ width: `${(totalOutstanding / totalExpected) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600 mt-1">
                      {((totalOutstanding / totalExpected) * 100).toFixed(1)}% outstanding
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Monthly Revenue Trend
                </h3>
                <div className="space-y-3">
                  {monthlyRevenue.map((trend) => (
                    <div key={trend.month}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-slate-700">{trend.month}</span>
                        <span className="text-xs font-bold text-slate-900">₦{(trend.collected / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all"
                          style={{ width: `${(trend.collected / 51200000) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Revenue & Expense Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  Revenue Breakdown
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {revenueBySource.map((revenue) => (
                  <div key={revenue.source} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-900">{revenue.source}</p>
                      <span className="text-sm font-bold text-slate-900">₦{(revenue.amount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${revenue.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{revenue.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Expense Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Expense Breakdown
                </h3>
              </div>
              <div className="divide-y divide-slate-200">
                {expenses.map((expense) => (
                  <div key={expense.category} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-slate-900">{expense.category}</p>
                      <span className="text-sm font-bold text-slate-900">₦{(expense.amount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{expense.percentage}% of total expenses</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Fee Collection by Class */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Fee Collection by Class
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Class</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Expected Fees</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Collected</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Collection %</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {feeCollectionByClass.map((classData) => (
                    <tr
                      key={classData.class}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedClass(classData.class)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{classData.class}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        <span className="font-semibold">₦{(classData.expectedFees / 1000000).toFixed(2)}M</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 font-semibold">₦{(classData.collected / 1000000).toFixed(2)}M</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">{classData.percentage}%</span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 font-semibold">₦{(classData.outstanding / 1000000).toFixed(2)}M</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Top Debtors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-slate-200 bg-orange-50">
              <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Top 5 Debtors (Outstanding Fees)
              </h3>
            </div>
            <div className="divide-y divide-slate-200">
              {topDebtors.map((student, index) => (
                <div key={student.name} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{index + 1}. {student.name}</p>
                      <p className="text-xs text-slate-600">{student.class}</p>
                    </div>
                    <span className="text-lg font-bold text-orange-600">₦{(student.outstanding / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${student.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{student.percentage}% of expected fees outstanding</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Financial Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-green-500/10 p-8 rounded-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Financial Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Positive Performance</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>93.4% collection rate demonstrates excellent fee management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Monthly revenue trend shows consistent growth from Jan to June</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>Net profit of ₦37.2M indicates healthy financial position</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>JSS 1 leading in collection with 95% rate</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Areas for Attention</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Outstanding balance of ₦3.8M needs active collection follow-up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Grade 3 has lowest collection rate (91.5%); requires intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Top 5 debtors owe ₦610K; consider payment plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-1">→</span>
                    <span>Staff salaries consume 45.3% of budget; review staffing levels</span>
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

export default FinancialReport;
